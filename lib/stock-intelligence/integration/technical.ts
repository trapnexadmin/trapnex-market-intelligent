import { calculateTechnicalStructure } from "@/lib/stock-intelligence/factors/technical";
import type { Candle } from "@/lib/stock-intelligence/factors/types";

export function buildTechnicalFactor(candles: Candle[]) {
  return {
    score: calculateTechnicalStructure(candles),
    confidence: candles.length >= 50 ? 100 : Math.round((candles.length / 50) * 100),
  };
}
