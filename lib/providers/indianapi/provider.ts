import type { BreadthSnapshot, MarketIndexSnapshot, MarketQuote } from "@/lib/domain/market";
import type { ProviderCapability, ProviderHealth } from "@/lib/domain/provider";
import type { MarketDataProvider } from "@/lib/providers/base";
import { indianApiRequest } from "./client";

const capabilities: ProviderCapability[] = ["quotes", "indices", "breadth", "news"];

export class IndianApiProvider implements MarketDataProvider {
  readonly name = "IndianAPI";
  readonly priority = 20;
  readonly capabilities = capabilities;

  async health(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();
    if (!process.env.INDIANAPI_API_KEY) {
      return { provider: this.name, status: "NOT_CONFIGURED", latencyMs: null, capabilities, lastSuccessfulAt: null, message: "INDIANAPI_API_KEY is missing", checkedAt };
    }
    const started = Date.now();
    try {
      await indianApiRequest("/trending");
      return { provider: this.name, status: "READY", latencyMs: Date.now() - started, capabilities, lastSuccessfulAt: checkedAt, checkedAt };
    } catch (e) {
      return { provider: this.name, status: "ERROR", latencyMs: Date.now() - started, capabilities, lastSuccessfulAt: null, message: e instanceof Error ? e.message : "Unknown provider error", checkedAt };
    }
  }

  async getQuotes(symbols: string[]): Promise<MarketQuote[]> {
    if (!process.env.INDIANAPI_API_KEY) return [];
    const requested = new Set(symbols.map((s) => s.toUpperCase()));
    const data = await indianApiRequest("/trending");
    const rows = [...(data?.trending_stocks?.top_gainers ?? []), ...(data?.trending_stocks?.top_losers ?? [])];

    return rows
      .filter((r: any) => !requested.size || requested.has(String(r.ticker_id).toUpperCase()))
      .map((r: any): MarketQuote => ({
        symbol: String(r.ticker_id),
        exchange: String(r.exchange_type ?? "NSE").toUpperCase().includes("BSE") ? "BSE" : "NSE",
        instrumentType: "EQUITY",
        price: Number.isFinite(Number(r.price)) ? Number(r.price) : null,
        previousClose: Number.isFinite(Number(r.close)) ? Number(r.close) : null,
        open: Number.isFinite(Number(r.open)) ? Number(r.open) : null,
        high: Number.isFinite(Number(r.high)) ? Number(r.high) : null,
        low: Number.isFinite(Number(r.low)) ? Number(r.low) : null,
        volume: Number.isFinite(Number(r.volume)) ? Number(r.volume) : null,
        timestamp: new Date(`${r.date ?? ""} ${r.time ?? ""}`).toISOString(),
        provider: this.name,
      }))
      .filter((q: MarketQuote) => q.price !== null);
  }

  async getIndices(_symbols: string[]): Promise<MarketIndexSnapshot[]> { return []; }
  async getBreadth(_market: string): Promise<BreadthSnapshot | null> { return null; }
}
