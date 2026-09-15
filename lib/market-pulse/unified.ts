import { calculateTrendPulse } from "@/lib/intelligence/pulse";
import { calculateCapPulse } from "./cap-pulse";
import { calculateSectorPulse } from "./sector-pulse";
import { subsetSnapshots } from "./subsets";
import type { MarketSnapshot } from "@/lib/intelligence/types";
import type { InstrumentClassification } from "@/lib/classification/types";

export function calculateUnifiedPulses(
  snapshots: MarketSnapshot[],
  classifications: InstrumentClassification[],
  sectors: string[] = ["BANK", "IT", "PHARMA", "AUTO", "ENERGY"],
) {
  const nifty = calculateTrendPulse({ snapshots });
  const capPulses = Object.fromEntries(
    (["LARGE", "MID", "SMALL"] as const).map((bucket) => {
      const subset = subsetSnapshots(snapshots, classifications, {
        capBucket: bucket,
      });
      return [bucket, calculateCapPulse(bucket, subset.snapshots)];
    }),
  );

  const sectorPulses = Object.fromEntries(
    sectors.map((sector) => {
      const subset = subsetSnapshots(snapshots, classifications, { sector });
      return [sector, calculateSectorPulse(sector, subset.snapshots)];
    }),
  );

  return { nifty, capPulses, sectorPulses };
}
