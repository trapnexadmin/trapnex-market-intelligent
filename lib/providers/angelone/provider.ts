import { generate } from "otplib";
import type { BreadthSnapshot, MarketIndexSnapshot, MarketQuote } from "@/lib/domain/market";
import type { ProviderCapability, ProviderHealth } from "@/lib/domain/provider";
import type { MarketDataProvider } from "@/lib/providers/base";
import { resolveEquityInstrument, resolveIndexInstrument } from "./instruments";

const API = "https://apiconnect.angelone.in";
const capabilities: ProviderCapability[] = ["quotes", "candles", "indices"];

const num = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const iso = (value: unknown) => {
  if (typeof value !== "string") return new Date().toISOString();
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d.toISOString() : new Date().toISOString();
};

export class AngelOneProvider implements MarketDataProvider {
  readonly name = "Angel One SmartAPI";
  readonly priority = 10;
  readonly capabilities = capabilities;
  private token: string | null = null;
  private tokenAt = 0;

  async health(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();
    const missing: string[] = [];
    for (const key of ["ANGEL_ONE_API_KEY", "ANGEL_ONE_CLIENT_CODE"]) {
      if (!process.env[key]) missing.push(key);
    }
    if (!process.env.ANGEL_ONE_PASSWORD && !process.env.ANGEL_ONE_PIN) {
      missing.push("ANGEL_ONE_PASSWORD|ANGEL_ONE_PIN");
    }
    if (!process.env.ANGEL_ONE_TOTP && !process.env.ANGEL_ONE_TOTP_SECRET) {
      missing.push("ANGEL_ONE_TOTP|ANGEL_ONE_TOTP_SECRET");
    }

    if (missing.length) {
      return {
        provider: this.name,
        status: "NOT_CONFIGURED",
        latencyMs: null,
        capabilities,
        lastSuccessfulAt: null,
        message: `Missing: ${missing.join(", ")}`,
        checkedAt,
      };
    }

    const started = Date.now();
    try {
      await this.login();
      return {
        provider: this.name,
        status: "READY",
        latencyMs: Date.now() - started,
        capabilities,
        lastSuccessfulAt: checkedAt,
        checkedAt,
      };
    } catch (error) {
      return {
        provider: this.name,
        status: "ERROR",
        latencyMs: Date.now() - started,
        capabilities,
        lastSuccessfulAt: null,
        message: error instanceof Error ? error.message : "Authentication failed",
        checkedAt,
      };
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

    const secret = process.env.ANGEL_ONE_TOTP_SECRET || process.env.ANGEL_ONE_TOTP;
    const password = process.env.ANGEL_ONE_PASSWORD || process.env.ANGEL_ONE_PIN;
    if (!secret || !password) throw new Error("ANGEL_ONE_NOT_CONFIGURED");

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

  private async quoteRequest(exchangeTokens: Record<string, string[]>) {
    const token = await this.login();
    const response = await fetch(`${API}/rest/secure/angelbroking/market/v1/quote/`, {
      method: "POST",
      headers: this.headers(token),
      body: JSON.stringify({ mode: "FULL", exchangeTokens }),
      cache: "no-store",
    });

    const payload = await response.json();
    if (!response.ok || payload?.status === false) {
      throw new Error(
        payload?.message || payload?.errorcode || `ANGEL_QUOTE_HTTP_${response.status}`,
      );
    }

    return payload?.data ?? { fetched: [], unfetched: [] };
  }

  async getQuotes(symbols: string[]): Promise<MarketQuote[]> {
    if (!symbols.length) return [];

    const rows = await Promise.all(
      symbols.map(async (symbol) => ({
        symbol: symbol.trim().toUpperCase(),
        instrument: await resolveEquityInstrument(symbol, "NSE"),
      })),
    );

    const valid = rows.filter(
      (row): row is typeof row & {
        instrument: NonNullable<typeof row.instrument>;
      } => Boolean(row.instrument),
    );

    if (!valid.length) {
      throw new Error(`ANGEL_INSTRUMENTS_NOT_FOUND:${symbols.join(",")}`);
    }

    const output: MarketQuote[] = [];

    // SmartAPI documents a maximum of 50 symbols per market-data request.
    for (let i = 0; i < valid.length; i += 50) {
      const batch = valid.slice(i, i + 50);
      const data = await this.quoteRequest({
        NSE: batch.map((row) => row.instrument.token),
      });

      for (const row of Array.isArray(data.fetched) ? data.fetched : []) {
        const price = num(row?.ltp);
        if (price === null) continue;

        output.push({
          symbol: String(row?.tradingSymbol ?? "")
            .replace(/-EQ$/i, "")
            .toUpperCase(),
          exchange: "NSE",
          instrumentToken: String(row?.symbolToken ?? ""),
          instrumentType: "EQUITY",
          price,
          previousClose: num(row?.close),
          open: num(row?.open),
          high: num(row?.high),
          low: num(row?.low),
          volume: num(row?.tradeVolume),
          timestamp: iso(row?.exchTradeTime ?? row?.exchFeedTime),
          provider: this.name,
        });
      }

      if (i + 50 < valid.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!output.length) throw new Error(`ANGEL_QUOTES_EMPTY:${symbols.join(",")}`);
    return output;
  }

  async getIndices(symbols: string[]): Promise<MarketIndexSnapshot[]> {
    const requested = symbols.length
      ? symbols.map((s) => s.trim().toUpperCase())
      : ["NIFTY 50", "BANK NIFTY", "SENSEX"];

    const rows = await Promise.all(
      requested.map(async (name) => ({
        name,
        instrument: await resolveIndexInstrument(name),
      })),
    );

    const valid = rows.filter(
      (row): row is typeof row & {
        instrument: NonNullable<typeof row.instrument>;
      } => Boolean(row.instrument),
    );

    if (!valid.length) throw new Error("ANGEL_INDEX_INSTRUMENTS_NOT_FOUND");

    const exchangeTokens: Record<string, string[]> = {};
    for (const row of valid) {
      const exchange = row.instrument.exch_seg === "bse_cm" ? "BSE" : "NSE";
      (exchangeTokens[exchange] ??= []).push(row.instrument.token);
    }

    const data = await this.quoteRequest(exchangeTokens);

    return (Array.isArray(data.fetched) ? data.fetched : [])
      .map((row: any): MarketIndexSnapshot => {
        const value = num(row?.ltp);
        const previousClose = num(row?.close);
        const change =
          value !== null && previousClose !== null ? value - previousClose : null;

        return {
          symbol: String(row?.symbolToken ?? ""),
          name: String(row?.tradingSymbol ?? ""),
          value,
          previousClose,
          change,
          changePercent:
            value !== null && previousClose
              ? (change! / previousClose) * 100
              : null,
          timestamp: iso(row?.exchTradeTime ?? row?.exchFeedTime),
          provider: this.name,
        };
      })
      .filter((row) => row.value !== null);
  }

  // SmartAPI does not expose a cash-market breadth endpoint through this
  // provider contract, so this capability is deliberately not advertised.
  async getBreadth(_market: string): Promise<BreadthSnapshot | null> {
    return null;
  }
}
