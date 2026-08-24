import type { BreadthSnapshot, MarketIndexSnapshot, MarketQuote } from "@/lib/domain/market";
import type { ProviderCapability, ProviderHealth } from "@/lib/domain/provider";
import type { MarketDataProvider } from "@/lib/providers/base";
import { indianApiRequest } from "./client";

const capabilities: ProviderCapability[] = ["quotes", "indices", "breadth", "news"];
const numberOrNull = (value: unknown) => { const n = Number(value); return Number.isFinite(n) ? n : null; };

const safeTimestamp = (value: unknown) => {
  const date = new Date(String(value ?? ""));
  return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
};

export class IndianApiProvider implements MarketDataProvider {
  readonly name = "IndianAPI";
  readonly priority = 20;
  readonly capabilities = capabilities;

  async health(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();
    if (!process.env.INDIANAPI_API_KEY) return { provider: this.name, status: "NOT_CONFIGURED", latencyMs: null, capabilities, lastSuccessfulAt: null, message: "INDIANAPI_API_KEY is missing", checkedAt };
    const started = Date.now();
    try {
      await indianApiRequest("/indices", { exchange: "NSE", index_type: "POPULAR" });
      return { provider: this.name, status: "READY", latencyMs: Date.now() - started, capabilities, lastSuccessfulAt: checkedAt, checkedAt };
    } catch (e) {
      return { provider: this.name, status: "ERROR", latencyMs: Date.now() - started, capabilities, lastSuccessfulAt: null, message: e instanceof Error ? e.message : "Unknown provider error", checkedAt };
    }
  }

  async getQuotes(symbols: string[]): Promise<MarketQuote[]> {
    if (!process.env.INDIANAPI_API_KEY) return [];

    // Empty symbols means "market universe" for the pulse/ingestion layer.
    const data = await indianApiRequest("/nse_stock_batch_live_price");
    const rows = data && typeof data === "object" ? data as Record<string, any> : {};
    const requested = new Set(symbols.map((s) => s.toUpperCase()));

    return Object.entries(rows)
      .filter(([key, row]) => !requested.size || requested.has(key.toUpperCase()) || requested.has(String(row?.symbol ?? "").toUpperCase()))
      .map(([key, row]): MarketQuote => ({
        symbol: String(row?.symbol ?? key),
        exchange: "NSE",
        instrumentType: "EQUITY",
        price: numberOrNull(row?.ltp ?? row?.price),
        previousClose: numberOrNull(row?.close ?? row?.previousClose),
        open: numberOrNull(row?.open),
        high: numberOrNull(row?.high),
        low: numberOrNull(row?.low),
        volume: numberOrNull(row?.volume),
        timestamp: safeTimestamp(row?.timestamp),
        provider: this.name,
      }))
      .filter((quote) => quote.price !== null);
  }

  async getIndices(symbols: string[]): Promise<MarketIndexSnapshot[]> {
    if (!process.env.INDIANAPI_API_KEY) return [];
    const data = await indianApiRequest("/indices", { index_type: "POPULAR" });
    const rows = Array.isArray(data?.indices) ? data.indices : [];
    const requested = new Set(symbols.map((s) => s.toUpperCase()));

    return rows
      .filter((row: any) => !requested.size || requested.has(String(row.name ?? row.tickerId).toUpperCase()))
      .map((row: any): MarketIndexSnapshot => ({
        symbol: String(row.tickerId ?? row.name),
        name: String(row.name),
        value: numberOrNull(row.price),
        previousClose: numberOrNull(row.previousClose ?? row.close),
        change: numberOrNull(row.netChange ?? row.change),
        changePercent: numberOrNull(row.percentChange ?? row.changePercent),
        timestamp: safeTimestamp(row.timestamp ?? row.date),
        provider: this.name,
      }))
      .filter((row: MarketIndexSnapshot) => row.value !== null);
  }

  async getBreadth(_market: string): Promise<BreadthSnapshot | null> {
    return null;
  }
}
