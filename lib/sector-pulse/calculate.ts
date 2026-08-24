import type { SectorPulse, SectorPulseInputRow } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

function direction(score: number | null, previousScore?: number | null): SectorPulse["direction"] {
  if (score === null) return "INSUFFICIENT_DATA";
  if (score >= 70) return "LEADING";
  if (previousScore != null && score - previousScore >= 5) return "IMPROVING";
  if (previousScore != null && score - previousScore <= -5) return "WEAKENING";
  if (score < 45) return "LAGGING";
  return "IMPROVING";
}

export function calculateSectorPulse(
  sector: string,
  rows: SectorPulseInputRow[],
  previousScore: number | null = null,
  calculatedAt = new Date(),
): SectorPulse {
  const valid = rows.filter(
    (row) => row.sector === sector && Number.isFinite(row.price),
  );

  if (!valid.length) {
    return {
      sector,
      score: null,
      direction: "INSUFFICIENT_DATA",
      breadth: null,
      momentum: null,
      volume: null,
      relativeStrength: null,
      news: null,
      earnings: null,
      confidence: 0,
      total: 0,
      calculatedAt: calculatedAt.toISOString(),
    };
  }

  const directionRows = valid.filter((row) => row.previousClose !== null);
  const breadth =
    directionRows.length
      ? (directionRows.filter((row) => row.price > (row.previousClose as number)).length /
          directionRows.length) *
        100
      : null;

  const momentum = breadth;

  const volumeRows = valid.filter(
    (row) => row.volume !== null && row.averageVolume20 !== null,
  );

  const volume =
    volumeRows.length
      ? (volumeRows.filter(
          (row) => (row.volume as number) >= (row.averageVolume20 as number),
        ).length /
          volumeRows.length) *
        100
      : null;

  const rsRows = valid.filter(
    (row) => row.return5d !== null && row.benchmarkReturn5d !== null,
  );

  const relativeStrength =
    rsRows.length
      ? clamp(
          50 +
            (rsRows.reduce(
              (sum, row) =>
                sum +
                ((row.return5d as number) -
                  (row.benchmarkReturn5d as number)),
              0,
            ) /
              rsRows.length) *
              10,
        )
      : null;

  const newsValues = valid
    .map((row) => row.newsScore)
    .filter((value): value is number => value !== null);

  const earningsValues = valid
    .map((row) => row.earningsScore)
    .filter((value): value is number => value !== null);

  const news = newsValues.length
    ? newsValues.reduce((a, b) => a + b, 0) / newsValues.length
    : null;

  const earnings = earningsValues.length
    ? earningsValues.reduce((a, b) => a + b, 0) / earningsValues.length
    : null;

  const components = [breadth, momentum, volume, relativeStrength, news, earnings].filter(
    (value): value is number => value !== null,
  );

  const score = components.length
    ? Math.round(
        (components.reduce((sum, value) => sum + value, 0) / components.length) * 10,
      ) / 10
    : null;

  return {
    sector,
    score,
    direction: direction(score, previousScore),
    breadth,
    momentum,
    volume,
    relativeStrength,
    news,
    earnings,
    confidence: Math.round((components.length / 6) * 100),
    total: valid.length,
    calculatedAt: calculatedAt.toISOString(),
  };
}
