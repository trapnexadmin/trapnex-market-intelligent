import type { MarketSnapshot } from "@/lib/intelligence/types";
import type { InstrumentClassification } from "@/lib/classification/types";

export function subsetSnapshots(
  snapshots: MarketSnapshot[],
  classifications: InstrumentClassification[],
  filter: { capBucket?: InstrumentClassification["capBucket"]; sector?: string },
) {
  const allowed = new Set(
    classifications
      .filter(
        (row) =>
          (!filter.capBucket || row.capBucket === filter.capBucket) &&
          (!filter.sector ||
            row.sector?.toUpperCase() === filter.sector.toUpperCase()),
      )
      .map((row) => row.symbol.toUpperCase()),
  );
  return {
    symbols: [...allowed],
    snapshots: snapshots.filter((s) => allowed.has(s.symbol.toUpperCase())),
  };
}
