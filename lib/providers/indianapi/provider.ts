import type { BreadthSnapshot, MarketIndexSnapshot, MarketQuote } from "@/lib/domain/market";
import type { ProviderCapability, ProviderHealth } from "@/lib/domain/provider";
import type { MarketDataProvider } from "@/lib/providers/base";
import { indianApiRequest } from "./client";

const capabilities: ProviderCapability[] = ["quotes", "indices", "breadth", "news"];
const num = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? n : null; };
const ts = (date: unknown, time: unknown) => {
  const n = new Date(`${date ?? ""} ${time ?? ""}`).getTime();
  return Number.isFinite(n) ? new Date(n).toISOString() : new Date().toISOString();
};

export class IndianApiProvider implements MarketDataProvider {
  readonly name = "IndianAPI";
  readonly priority = 20;
  readonly capabilities = capabilities;

  async health(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();
    if (!process.env.INDIANAPI_API_KEY) return { provider: this.name, status: "NOT_CONFIGURED", latencyMs: null, capabilities, lastSuccessfulAt: null, message: "INDIANAPI_API_KEY is missing", checkedAt };
    const start = Date.now();
    try {
      await indianApiRequest("/indices", { exchange: "NSE", index_type: "POPULAR" });
      return { provider: this.name, status: "READY", latencyMs: Date.now() - start, capabilities, lastSuccessfulAt: checkedAt, checkedAt };
    } catch (e) {
      return { provider: this.name, status: "ERROR", latencyMs: Date.now() - start, capabilities, lastSuccessfulAt: null, message: e instanceof Error ? e.message : "Unknown provider error", checkedAt };
    }
  }

  async getQuotes(symbols: string[]): Promise<MarketQuote[]> {
    if (!process.env.INDIANAPI_API_KEY || !symbols.length) return [];
    const data = await indianApiRequest("/nse_stock_batch_live_price");
    const rows = data && typeof data === "object" ? data as Record<string, any> : {};
    const requested = new Set(symbols.map(s => s.toUpperCase()));
    return Object.entries(rows)
      .filter(([key, row]) => requested.has(key.toUpperCase()) || requested.has(String(row?.symbol ?? "").toUpperCase()))
      .map(([key, row]): MarketQuote => ({
        symbol: String(row?.symbol ?? key), exchange: "NSE", instrumentType: "EQUITY",
        price: num(row?.ltp), previousClose: num(row?.close), open: num(row?.open),
        high: num(row?.high), low: num(row?.low), volume: num(row?.volume),
        timestamp: row?.timestamp ? new Date(row.timestamp).toISOString() : new Date().toISOString(),
        provider: this.name,
      })).filter(q => q.price !== null);
  }

  async getIndices(symbols: string[]): Promise<MarketIndexSnapshot[]> {
    if (!process.env.INDIANAPI_API_KEY) return [];
    const data = await indianApiRequest("/indices", { index_type: "POPULAR" });
    const rows = Array.isArray(data?.indices) ? data.indices : [];
    const requested = new Set(symbols.map(s => s.toUpperCase()));
    return rows.filter((r:any) => !requested.size || requested.has(String(r.name ?? r.tickerId).toUpperCase()))
      .map((r:any): MarketIndexSnapshot => ({
        symbol: String(r.tickerId ?? r.name), name: String(r.name), value: num(r.price),
        previousClose: null, change: num(r.netChange), changePercent: num(r.percentChange),
        timestamp: ts(r.date, r.time), provider: this.name,
      })).filter((x: MarketIndexSnapshot) => x.value !== null);
  }

  async getBreadth(_market: string): Promise<BreadthSnapshot | null> { return null; }
}
