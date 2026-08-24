import type { CapSegment } from "./types";

export interface MarketCapClassification {
  symbol: string;
  segment: CapSegment;
  rank: number | null;
  effectiveDate: string | null;
  source: "AMFI" | "SEBI" | "OTHER";
}

/**
 * Classification is deliberately data-driven.
 * Do not hard-code company names or stale rankings here.
 */
export function toSegment(rank: number | null): CapSegment | null {
  if (rank === null || !Number.isFinite(rank) || rank <= 0) return null;
  if (rank <= 100) return "LARGE";
  if (rank <= 250) return "MID";
  return "SMALL";
}
