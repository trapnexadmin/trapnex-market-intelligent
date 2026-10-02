import { resolveQuotes } from "@/lib/providers/registry";
import { validateQuotes } from "@/lib/market-data/quality";
import { quoteToSyntheticCandle } from "./market-candles";

export async function loadValidatedQuote(symbol: string) {
  const resolved = await resolveQuotes([symbol]);
  const quality = validateQuotes(resolved.quotes);
  const quote = quality.accepted.find((row) => row.symbol.toUpperCase() === symbol.toUpperCase()) ?? quality.accepted[0] ?? null;
  return {
    quote,
    provider: resolved.provider,
    fallbackUsed: resolved.fallbackUsed,
    errors: [...resolved.errors, ...quality.rejected.map((r) => `${r.symbol}:${r.reason}`)],
    candle: quote ? quoteToSyntheticCandle(quote) : null,
  };
}
