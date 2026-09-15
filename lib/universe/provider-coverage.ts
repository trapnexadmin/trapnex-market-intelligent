import type { MarketSnapshot } from "@/lib/intelligence/types";
import type { InstrumentClassification } from "@/lib/classification/types";

export interface ProviderCoverageRow {
  symbol: string;
  classified: boolean;
  marketObserved: boolean;
  capBucket: "LARGE"|"MID"|"SMALL"|null;
  sector: string|null;
}

export function buildProviderCoverage(
  snapshots: MarketSnapshot[],
  classifications: InstrumentClassification[],
): ProviderCoverageRow[] {
  const snapshotSymbols = new Set(snapshots.map((x)=>x.symbol.toUpperCase()));
  return classifications.map((row)=>({
    symbol: row.symbol.toUpperCase(),
    classified: true,
    marketObserved: snapshotSymbols.has(row.symbol.toUpperCase()),
    capBucket: row.capBucket,
    sector: row.sector,
  }));
}

export function calculateProviderCoverage(rows: ProviderCoverageRow[]) {
  const total=rows.length;
  const observed=rows.filter((x)=>x.marketObserved).length;
  return {
    total,
    marketObserved: observed,
    marketCoveragePct: total ? Math.round((observed/total)*100) : 0,
    missingMarketSymbols: rows.filter((x)=>!x.marketObserved).map((x)=>x.symbol),
  };
}
