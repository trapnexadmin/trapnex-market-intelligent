import type { BreadthSnapshot, MarketIndexSnapshot, MarketQuote } from "@/lib/domain/market";
import type { ProviderCapability, ProviderHealth } from "@/lib/domain/provider";
import type { MarketDataProvider } from "@/lib/providers/base";
import { indianApiRequest } from "./client";

const capabilities: ProviderCapability[] = ["quotes", "indices", "breadth", "news"];

const n = (v: unknown) => {
  const value = Number(v);
  return Number.isFinite(value) ? value : null;
};

const timestamp = (date?: unknown, time?: unknown, fallback?: unknown) => {
  const raw = date && time ? `${date} ${time}` : fallback;
  const parsed = new Date(String(raw ?? ""));
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
};

function normalizeStock(row: any, fallbackSymbol?: string): MarketQuote | null {
  const price = n(row?.ltp ?? row?.price);
  const previousClose = n(row?.close ?? row?.previousClose);
  if (price === null) return null;

  return {
    symbol: String(row?.symbol ?? row?.ticker ?? row?.ticker_id ?? fallbackSymbol ?? ""),
    exchange: String(row?.exchange_type ?? "NSI").toUpperCase().includes("BSE") ? "BSE" : "NSE",
    instrumentType: "EQUITY",
    price,
    previousClose,
    open: n(row?.open),
    high: n(row?.high),
    low: n(row?.low),
    volume: n(row?.volume),
    timestamp: timestamp(row?.date, row?.time, row?.timestamp),
    provider: "IndianAPI",
  };
}

export class IndianApiProvider implements MarketDataProvider {
  readonly name = "IndianAPI";
  readonly priority = 20;
  readonly capabilities = capabilities;

  async health(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();
    if (!process.env.INDIANAPI_API_KEY) {
      return {
        provider: this.name, status: "NOT_CONFIGURED", latencyMs: null,
        capabilities, lastSuccessfulAt: null,
        message: "INDIANAPI_API_KEY is missing", checkedAt,
      };
    }

    const started = Date.now();
    try {
      await indianApiRequest("/indices", { exchange: "NSE", index_type: "POPULAR" });
      return {
        provider: this.name, status: "READY", latencyMs: Date.now() - started,
        capabilities, lastSuccessfulAt: checkedAt, checkedAt,
      };
    } catch (error) {
      return {
        provider: this.name, status: "ERROR", latencyMs: Date.now() - started,
        capabilities, lastSuccessfulAt: null,
        message: error instanceof Error ? error.message : "IndianAPI health check failed",
        checkedAt,
      };
    }
  }

  async getQuotes(symbols: string[]): Promise<MarketQuote[]> {
    if (!process.env.INDIANAPI_API_KEY) return [];

    // Batch live-price requires an explicit symbol list. For the market-pulse
    // universe, use the documented /trending endpoint instead.
    if (!symbols.length) {
      const data = await indianApiRequest("/trending", { exchange: "NSE" });
      const trending = data?.trending_stocks ?? {};
      const rows = [
        ...(Array.isArray(trending.top_gainers) ? trending.top_gainers : []),
        ...(Array.isArray(trending.top_losers) ? trending.top_losers : []),
      ];
      return rows.map((row: any) => normalizeStock(row)).filter(Boolean) as MarketQuote[];
    }

    const response = await fetch(
      `${process.env.INDIANAPI_BASE_URL || "https://stock.indianapi.in"}/nse_stock_batch_live_price`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.INDIANAPI_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock_symbols: symbols }),
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error(`IndianAPI batch quotes ${response.status}`);

    const data = await response.json();
    const rows = Array.isArray(data) ? data : Object.entries(data ?? {}).map(([symbol, row]) => ({ symbol, ...(row as object) }));

    return rows.map((row: any) => normalizeStock(row, row.symbol)).filter(Boolean) as MarketQuote[];
  }

  async getIndices(symbols: string[]): Promise<MarketIndexSnapshot[]> {
    if (!process.env.INDIANAPI_API_KEY) return [];

    const data = await indianApiRequest("/indices", { exchange: "NSE", index_type: "POPULAR" });
    const rows = Array.isArray(data?.indices) ? data.indices : [];
    const requested = new Set(symbols.map((s) => s.toUpperCase()));

    return rows
      .filter((row: any) => !requested.size || requested.has(String(row.name ?? "").toUpperCase()))
      .map((row: any): MarketIndexSnapshot => ({
        symbol: String(row.tickerId ?? row.name),
        name: String(row.name),
        value: n(row.price),
        previousClose: n(row.previousClose) ?? (
          n(row.price) !== null && n(row.netChange) !== null
            ? n(row.price)! - n(row.netChange)!
            : null
        ),
        change: n(row.netChange),
        changePercent: n(row.percentChange),
        timestamp: timestamp(row.date, row.time),
        provider: this.name,
      }))
      .filter((row) => row.value !== null);
  }

  async getBreadth(_market: string): Promise<BreadthSnapshot | null> {
    return null;
  }
}
