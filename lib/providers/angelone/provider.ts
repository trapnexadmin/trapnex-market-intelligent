import { generate } from "otplib";
import type { BreadthSnapshot, MarketIndexSnapshot, MarketQuote } from "@/lib/domain/market";
import type { ProviderCapability, ProviderHealth } from "@/lib/domain/provider";
import type { MarketDataProvider } from "@/lib/providers/base";

const API = "https://apiconnect.angelone.in";
const capabilities: ProviderCapability[] = ["quotes", "candles", "indices", "breadth"];

export class AngelOneProvider implements MarketDataProvider {
  readonly name = "Angel One SmartAPI";
  readonly priority = 10;
  readonly capabilities = capabilities;
  private token: string | null = null;
  private tokenAt = 0;

  async health(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();
    const missing: string[] = [];
    for (const key of ["ANGEL_ONE_API_KEY", "ANGEL_ONE_CLIENT_CODE"]) if (!process.env[key]) missing.push(key);
    if (!process.env.ANGEL_ONE_PASSWORD && !process.env.ANGEL_ONE_PIN) missing.push("ANGEL_ONE_PASSWORD|ANGEL_ONE_PIN");
    if (!process.env.ANGEL_ONE_TOTP && !process.env.ANGEL_ONE_TOTP_SECRET) missing.push("ANGEL_ONE_TOTP|ANGEL_ONE_TOTP_SECRET");

    if (missing.length) return { provider: this.name, status: "NOT_CONFIGURED", latencyMs: null, capabilities, lastSuccessfulAt: null, message: `Missing: ${missing.join(", ")}`, checkedAt };

    const started = Date.now();
    try {
      await this.login();
      return { provider: this.name, status: "READY", latencyMs: Date.now() - started, capabilities, lastSuccessfulAt: checkedAt, checkedAt };
    } catch (e) {
      return { provider: this.name, status: "ERROR", latencyMs: Date.now() - started, capabilities, lastSuccessfulAt: null, message: e instanceof Error ? e.message : "Authentication failed", checkedAt };
    }
  }

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
    const otpSecret = process.env.ANGEL_ONE_TOTP || process.env.ANGEL_ONE_TOTP_SECRET;
    const password = process.env.ANGEL_ONE_PASSWORD || process.env.ANGEL_ONE_PIN;
    if (!otpSecret || !password) throw new Error("Missing Angel One authentication variables");

    const totp = await generate({ secret: otpSecret });
    const response = await fetch(`${API}/rest/auth/angelbroking/user/v1/loginByPassword`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ clientcode: process.env.ANGEL_ONE_CLIENT_CODE, password, totp, state: process.env.ANGEL_ONE_STATE || "live" }),
    });
    const payload = await response.json();
    if (!response.ok || !payload?.status || !payload?.data?.jwtToken) throw new Error(payload?.message || `Angel One login ${response.status}`);
    this.token = payload.data.jwtToken;
    this.tokenAt = Date.now();
    return this.token;
  }

  async getQuotes(_symbols: string[]): Promise<MarketQuote[]> { await this.login(); return []; }
  async getIndices(_symbols: string[]): Promise<MarketIndexSnapshot[]> { await this.login(); return []; }
  async getBreadth(_market: string): Promise<BreadthSnapshot | null> { await this.login(); return null; }
}
