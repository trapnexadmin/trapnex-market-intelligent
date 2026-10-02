import { AngelOneHistoricalProvider } from "./angelone/candle-provider";
import type { HistoricalCandleQuery } from "./types";

const providers = [new AngelOneHistoricalProvider()].sort((a, b) => a.priority - b.priority);

export async function resolveHistoricalCandles(query: HistoricalCandleQuery) {
  const errors: string[] = [];
  for (const provider of providers) {
    try {
      const candles = await provider.getHistoricalCandles(query);
      if (candles.length) {
        return { provider: provider.name, candles, errors };
      }
    } catch (error) {
      errors.push(`${provider.name}: ${error instanceof Error ? error.message : "unknown provider error"}`);
    }
  }
  return { provider: null, candles: [], errors };
}
