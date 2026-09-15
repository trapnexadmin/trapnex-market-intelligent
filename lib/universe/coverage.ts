import type { InstrumentClassification } from "@/lib/classification/types";

export interface UniverseCoverage {
  total: number;
  large: number;
  mid: number;
  small: number;
  classifiedWithSector: number;
  sectorCoveragePct: number;
  capCoveragePct: number;
}

export function calculateUniverseCoverage(
  rows: InstrumentClassification[],
): UniverseCoverage {
  const total = rows.length;
  const large = rows.filter((x) => x.capBucket === "LARGE").length;
  const mid = rows.filter((x) => x.capBucket === "MID").length;
  const small = rows.filter((x) => x.capBucket === "SMALL").length;
  const classifiedWithSector = rows.filter(
    (x) => Boolean(x.sector?.trim()),
  ).length;

  return {
    total,
    large,
    mid,
    small,
    classifiedWithSector,
    sectorCoveragePct: total
      ? Math.round((classifiedWithSector / total) * 100)
      : 0,
    capCoveragePct: total
      ? Math.round(((large + mid + small) / total) * 100)
      : 0,
  };
}
