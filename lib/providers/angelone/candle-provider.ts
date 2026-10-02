import { generate } from "otplib";
import type { HistoricalCandleProvider, HistoricalCandleQuery } from "../types";
import { fetchAngelHistoricalCandles } from "./historical";
import { resolveEquityInstrument } from "./instruments";

const API = "https://apiconnect.angelone.in";

export class AngelOneHistoricalProvider implements HistoricalCandleProvider {
  readonly name = "Angel One SmartAPI";
  readonly priority = 10;
  private token: string | null = null;
  private tokenAt = 0;

  private headers(authorization?: string) {
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

  private async login() {
    if (this.token && Date.now() - this.tokenAt < 25 * 60 * 1000) return this.token;
    const secret = process.env.ANGEL_ONE_TOTP_SECRET || process.env.ANGEL_ONE_TOTP;
    const password = process.env.ANGEL_ONE_PASSWORD || process.env.ANGEL_ONE_PIN;
    if (!process.env.ANGEL_ONE_API_KEY || !process.env.ANGEL_ONE_CLIENT_CODE || !secret || !password) {
      throw new Error("ANGEL_ONE_NOT_CONFIGURED");
    }
    const totp = await generate({ secret });
    const response = await fetch(`${API}/rest/auth/angelbroking/user/v1/loginByPassword`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        clientcode: process.env.ANGEL_ONE_CLIENT_CODE,
        password,
        totp,
        state: process.env.ANGEL_ONE_STATE || "live",
      }),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok || !payload?.status || !payload?.data?.jwtToken) {
      throw new Error(payload?.message || `ANGEL_LOGIN_${response.status}`);
    }
    this.token = payload.data.jwtToken;
    this.tokenAt = Date.now();
    return this.token;
  }

  async health() {
    try {
      await this.login();
      return { provider: this.name, status: "READY" as const };
    } catch (error) {
      return {
        provider: this.name,
        status: "ERROR" as const,
        message: error instanceof Error ? error.message : "Angel One health check failed",
      };
    }
  }

  async getHistoricalCandles(query: HistoricalCandleQuery) {
    const token = await this.login();
    const instrument = query.instrumentToken
      ? { token: query.instrumentToken }
      : await resolveEquityInstrument(query.symbol, query.exchange);
    if (!instrument?.token) throw new Error(`ANGEL_INSTRUMENT_NOT_FOUND:${query.symbol}`);
    return fetchAngelHistoricalCandles(
      instrument.token,
      query.exchange,
      query.interval,
      query.from,
      query.to,
      token,
    );
  }
}
