import type { Candle } from "./types";
import { calculateTechnicalStructure } from "./technical";

export function calculateTechnicalFactor(candles: Candle[]) {
  return {
    score: calculateTechnicalStructure(candles),
    source: candles.length ? "historical_candles" : null,
  };
}
