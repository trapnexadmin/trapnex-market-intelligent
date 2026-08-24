import { generate } from "otplib";
import { ANGEL_ONE_API } from "./constants";
import type { AngelSession } from "./types";

let cachedSession: AngelSession | null = null;

function headers(authorization?: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-UserType": "USER",
    "X-SourceID": "WEB",
    "X-ClientLocalIP": process.env.ANGEL_ONE_CLIENT_LOCAL_IP || "127.0.0.1",
    "X-ClientPublicIP": process.env.ANGEL_ONE_CLIENT_PUBLIC_IP || "",
    "X-MACAddress": process.env.ANGEL_ONE_MAC_ADDRESS || "00:00:00:00:00:00",
    "X-PrivateKey": process.env.ANGEL_ONE_API_KEY || "",
    ...(authorization ? { Authorization: `Bearer ${authorization}` } : {}),
  };
}

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export async function getAngelSession(force = false): Promise<AngelSession> {
  if (!force && cachedSession && Date.now() - cachedSession.createdAt < 20 * 60 * 1000) {
    return cachedSession;
  }

  const clientcode = required("ANGEL_ONE_CLIENT_CODE");
  const password = process.env.ANGEL_ONE_PASSWORD || process.env.ANGEL_ONE_PIN;
  const secret = process.env.ANGEL_ONE_TOTP_SECRET || process.env.ANGEL_ONE_TOTP;

  if (!password) throw new Error("ANGEL_ONE_PASSWORD or ANGEL_ONE_PIN is not configured");
  if (!secret) throw new Error("ANGEL_ONE_TOTP_SECRET is not configured");

  const totp = await generate({ secret });

  const response = await fetch(
    `${ANGEL_ONE_API}/rest/auth/angelbroking/user/v1/loginByPassword`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        clientcode,
        password,
        totp,
        state: process.env.ANGEL_ONE_STATE || "live",
      }),
      cache: "no-store",
    },
  );

  const payload = await response.json();

  if (!response.ok || !payload?.status || !payload?.data?.jwtToken) {
    throw new Error(payload?.message || `Angel One login failed (${response.status})`);
  }

  cachedSession = {
    jwtToken: payload.data.jwtToken,
    refreshToken: payload.data.refreshToken,
    feedToken: payload.data.feedToken,
    state: payload.data.state,
    createdAt: Date.now(),
  };

  return cachedSession;
}

export async function angelRequest<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  let session = await getAngelSession();

  const response = await fetch(`${ANGEL_ONE_API}${path}`, {
    ...init,
    headers: {
      ...headers(session.jwtToken),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if ((response.status === 401 || response.status === 403) && retry) {
    session = await getAngelSession(true);
    return angelRequest<T>(path, init, false);
  }

  const payload = await response.json();

  if (!response.ok || payload?.status === false) {
    throw new Error(payload?.message || `Angel One request failed (${response.status})`);
  }

  return payload.data as T;
}

export function clearAngelSession() {
  cachedSession = null;
}
