import { resolveHistoricalCandles } from "@/lib/providers/historical-registry";
import { resolveEquityInstrument } from "@/lib/providers/angelone/instruments";
import type { Candle } from "../factors/types";

export async function loadHistoricalCandles(
  symbol: string,
  options?: {
    exchange?: "NSE" | "BSE";
    interval?: "ONE_DAY" | "ONE_HOUR" | "FIFTEEN_MINUTE" | "FIVE_MINUTE" | "ONE_MINUTE";
    days?: number;
  },
): Promise<{ candles: Candle[]; provider: string | null; instrumentToken: string | null; errors: string[] }> {
  const exchange = options?.exchange ?? "NSE";
  const interval = options?.interval ?? "ONE_DAY";
  const days = Math.max(1, Math.min(options?.days ?? 120, 2000));
  const instrument = await resolveEquityInstrument(symbol, exchange);
  const result = await resolveHistoricalCandles({
    symbol,
    exchange,
    instrumentToken: instrument?.token ?? "",
    interval,
    from: new Date(Date.now() - days * 86400000).toISOString(),
    to: new Date().toISOString(),
  });
  return {
    candles: result.candles,
    provider: result.provider,
    instrumentToken: instrument?.token ?? null,
    errors: result.errors,
  };
}
