import type { BreadthInputRow, MarketBreadth } from "./types";

const clamp = (value: number) => Math.max(0, Math.min(100, value));
const percentage = (numerator: number, denominator: number) =>
  denominator > 0 ? (numerator / denominator) * 100 : null;

export function calculateBreadth(
  market: string,
  rows: BreadthInputRow[],
  calculatedAt = new Date(),
): MarketBreadth {
  const total = rows.length;

  if (!total) {
    return {
      market,
      total: 0,
      advancers: 0,
      decliners: 0,
      unchanged: 0,
      advanceDeclineRatio: null,
      above20DmaPercent: null,
      above50DmaPercent: null,
      above200DmaPercent: null,
      volumeAdvancingPercent: null,
      breadthThrust: null,
      score: null,
      confidence: 0,
      coverage: { price: 0, dma20: 0, dma50: 0, dma200: 0, volume: 0 },
      status: "INSUFFICIENT_DATA",
      calculatedAt: calculatedAt.toISOString(),
    };
  }

  let advancers = 0;
  let decliners = 0;
  let unchanged = 0;

  let valid20 = 0;
  let above20 = 0;
  let valid50 = 0;
  let above50 = 0;
  let valid200 = 0;
  let above200 = 0;

  let volumeDenominator = 0;
  let volumeAdvancing = 0;

  for (const row of rows) {
    if (row.previousClose !== null) {
      if (row.price > row.previousClose) advancers += 1;
      else if (row.price < row.previousClose) decliners += 1;
      else unchanged += 1;
    }

    if (row.dma20 !== null) {
      valid20 += 1;
      if (row.price > row.dma20) above20 += 1;
    }

    if (row.dma50 !== null) {
      valid50 += 1;
      if (row.price > row.dma50) above50 += 1;
    }

    if (row.dma200 !== null) {
      valid200 += 1;
      if (row.price > row.dma200) above200 += 1;
    }

    if (
      row.volume !== null &&
      row.averageVolume20 !== null &&
      row.previousClose !== null
    ) {
      volumeDenominator += row.volume;
      if (row.price > row.previousClose) {
        volumeAdvancing += row.volume;
      }
    }
  }

  const priceCoverage = (advancers + decliners + unchanged) / total;
  const above20Pct = percentage(above20, valid20);
  const above50Pct = percentage(above50, valid50);
  const above200Pct = percentage(above200, valid200);
  const volumePct =
    volumeDenominator > 0
      ? (volumeAdvancing / volumeDenominator) * 100
      : null;

  const breadthThrust =
    advancers + decliners > 0
      ? (advancers / (advancers + decliners)) * 100
      : null;

  const componentScores = [
    priceCoverage > 0 ? (advancers / Math.max(1, advancers + decliners + unchanged)) * 100 : null,
    above20Pct,
    above50Pct,
    above200Pct,
    volumePct,
  ].filter((value): value is number => value !== null);

  const score = componentScores.length
    ? clamp(componentScores.reduce((sum, value) => sum + value, 0) / componentScores.length)
    : null;

  const coverage = {
    price: Math.round(priceCoverage * 100),
    dma20: total ? Math.round((valid20 / total) * 100) : 0,
    dma50: total ? Math.round((valid50 / total) * 100) : 0,
    dma200: total ? Math.round((valid200 / total) * 100) : 0,
    volume: total
      ? Math.round(
          (rows.filter(
            (row) =>
              row.volume !== null &&
              row.averageVolume20 !== null &&
              row.previousClose !== null,
          ).length /
            total) *
            100,
        )
      : 0,
  };

  const confidence = Math.round(
    (coverage.price +
      coverage.dma20 +
      coverage.dma50 +
      coverage.dma200 +
      coverage.volume) /
      5,
  );

  return {
    market,
    total,
    advancers,
    decliners,
    unchanged,
    advanceDeclineRatio:
      decliners > 0 ? advancers / decliners : advancers > 0 ? advancers : null,
    above20DmaPercent: above20Pct,
    above50DmaPercent: above50Pct,
    above200DmaPercent: above200Pct,
    volumeAdvancingPercent: volumePct,
    breadthThrust,
    score,
    confidence,
    coverage,
    status: score === null ? "INSUFFICIENT_DATA" : "READY",
    calculatedAt: calculatedAt.toISOString(),
  };
}
