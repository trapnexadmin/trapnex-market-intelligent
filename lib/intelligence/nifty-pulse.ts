import type { MarketSnapshot, TrendPulse } from "./types";
import { calculateTrendPulse } from "./pulse";

export interface NiftyPulseResult extends TrendPulse {
  index: "NIFTY 50";
  regime: "BULLISH" | "NEUTRAL" | "BEARISH" | "INSUFFICIENT_DATA";
}

export function calculateNiftyPulse(input: {
  snapshots: MarketSnapshot[];
  breadth?: Parameters<typeof calculateTrendPulse>[0]["breadth"];
  newsScore?: number;
  riskScore?: number;
  calculatedAt?: Date;
}): NiftyPulseResult {
  const pulse = calculateTrendPulse(input);

  return {
    ...pulse,
    index: "NIFTY 50",
    regime: pulse.direction,
  };
}
