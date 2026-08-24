export type CapSegment = "LARGE" | "MID" | "SMALL";

export interface CapPulseInputRow {
  symbol: string;
  segment: CapSegment;
  price: number;
  previousClose: number | null;
  volume: number | null;
  averageVolume20: number | null;
  return5d: number | null;
  benchmarkReturn5d: number | null;
}

export interface CapPulse {
  segment: CapSegment;
  label: "Large Cap" | "Mid Cap" | "Small Cap";
  score: number | null;
  direction: "BULLISH" | "NEUTRAL" | "BEARISH" | "INSUFFICIENT_DATA";
  change: number | null;
  breadth: number | null;
  momentum: number | null;
  volume: number | null;
  relativeStrength: number | null;
  confidence: number;
  total: number;
  calculatedAt: string;
}
