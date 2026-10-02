import type { Candle } from "../factors/types";
import type { MarketQuote } from "@/lib/domain/market";

export function quoteToSyntheticCandle(quote: MarketQuote): Candle | null {
  if (quote.price === null || !Number.isFinite(quote.price)) return null;
  return {
    timestamp: quote.timestamp,
    open: quote.open ?? quote.price,
    high: quote.high ?? quote.price,
    low: quote.low ?? quote.price,
    close: quote.price,
    volume: quote.volume ?? null,
  };
}
