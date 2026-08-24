import type { SectorPulse } from "./types";

export interface SectorRotationPoint {
  sector: string;
  score: number;
  change: number | null;
  direction: SectorPulse["direction"];
}

export function calculateSectorRotation(
  current: SectorPulse[],
  previous: Map<string, number>,
): SectorRotationPoint[] {
  return current
    .filter((item) => item.score !== null)
    .map((item) => ({
      sector: item.sector,
      score: item.score as number,
      change: previous.has(item.sector)
        ? (item.score as number) - (previous.get(item.sector) as number)
        : null,
      direction: item.direction,
    }))
    .sort((a, b) => b.score - a.score);
}
