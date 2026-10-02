import type { Candle } from "../factors/types";

export interface HistoricalQuality {
  available: boolean;
  candleCount: number;
  usableForTechnicalScore: boolean;
  coverageDaysApprox: number;
}

export function assessHistoricalQuality(
  candles: Candle[],
): HistoricalQuality {
  const candleCount = candles.length;
  return {
    available: candleCount > 0,
    candleCount,
    usableForTechnicalScore: candleCount >= 50,
    coverageDaysApprox: candleCount,
  };
}
