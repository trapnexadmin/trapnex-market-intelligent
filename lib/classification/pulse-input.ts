import type { InstrumentClassification } from "./types";
export function filterSymbols(
  rows: InstrumentClassification[],
  filter: {
    capBucket?: InstrumentClassification["capBucket"];
    sector?: string;
  },
) {
  return rows.filter(
    (row) =>
      (!filter.capBucket || row.capBucket === filter.capBucket) &&
      (!filter.sector ||
        row.sector?.toUpperCase() === filter.sector.toUpperCase()),
  );
}
