import type { CapPulse, CapPulseInputRow, CapSegment } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

const labels: Record<CapSegment, CapPulse["label"]> = {
  LARGE: "Large Cap",
  MID: "Mid Cap",
  SMALL: "Small Cap",
};

function direction(score: number | null): CapPulse["direction"] {
  if (score === null) return "INSUFFICIENT_DATA";
  if (score >= 65) return "BULLISH";
  if (score <= 35) return "BEARISH";
  return "NEUTRAL";
}

export function calculateCapPulse(
  segment: CapSegment,
  rows: CapPulseInputRow[],
  calculatedAt = new Date(),
): CapPulse {
  const valid = rows.filter(
    (row) => row.segment === segment && Number.isFinite(row.price),
  );

  if (!valid.length) {
    return {
      segment,
      label: labels[segment],
      score: null,
      direction: "INSUFFICIENT_DATA",
      change: null,
      breadth: null,
      momentum: null,
      volume: null,
      relativeStrength: null,
      confidence: 0,
      total: 0,
      calculatedAt: calculatedAt.toISOString(),
    };
  }

  const directionRows = valid.filter((row) => row.previousClose !== null);
  const advancers = directionRows.filter(
    (row) => row.price > (row.previousClose as number),
  ).length;

  const breadth =
    directionRows.length > 0 ? (advancers / directionRows.length) * 100 : null;

  const momentum = breadth;

  const volumeRows = valid.filter(
    (row) => row.volume !== null && row.averageVolume20 !== null,
  );

  const volume =
    volumeRows.length > 0
      ? (volumeRows.filter(
          (row) => (row.volume as number) >= (row.averageVolume20 as number),
        ).length /
          volumeRows.length) *
        100
      : null;

  const relativeRows = valid.filter(
    (row) => row.return5d !== null && row.benchmarkReturn5d !== null,
  );

  const relativeStrength =
    relativeRows.length > 0
      ? clamp(
          50 +
            (relativeRows.reduce(
              (sum, row) =>
                sum +
                ((row.return5d as number) - (row.benchmarkReturn5d as number)),
              0,
            ) /
              relativeRows.length) *
              10,
        )
      : null;

  const components = [breadth, momentum, volume, relativeStrength].filter(
    (value): value is number => value !== null,
  );

  const score = components.length
    ? Math.round(
        (components.reduce((sum, value) => sum + value, 0) /
          components.length) *
          10,
      ) / 10
    : null;

  return {
    segment,
    label: labels[segment],
    score,
    direction: direction(score),
    change: null,
    breadth,
    momentum,
    volume,
    relativeStrength,
    confidence: Math.round((components.length / 4) * 100),
    total: valid.length,
    calculatedAt: calculatedAt.toISOString(),
  };
}
