import type { BreadthInputRow, MarketBreadth } from "./types";

const pct = (n: number, d: number) => d > 0 ? (n / d) * 100 : null;
const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function calculateBreadth(
  market: string,
  rows: BreadthInputRow[],
  calculatedAt = new Date(),
): MarketBreadth {
  const valid = rows.filter((r) =>
    Number.isFinite(r.price) &&
    (r.previousClose == null || Number.isFinite(r.previousClose)),
  );

  if (!valid.length) {
    return {
      market, total: 0, advancers: 0, decliners: 0, unchanged: 0,
      advanceDeclineRatio: null,
      above20DmaPercent: null, above50DmaPercent: null, above200DmaPercent: null,
      volumeAdvancingPercent: null, breadthThrust: null,
      score: null, confidence: 0, status: "INSUFFICIENT_DATA",
      calculatedAt: calculatedAt.toISOString(),
    };
  }

  let advancers = 0, decliners = 0, unchanged = 0;
  let valid20 = 0, above20 = 0, valid50 = 0, above50 = 0, valid200 = 0, above200 = 0;
  let volumeCandidates = 0, advancingVolume = 0;

  for (const row of valid) {
    if (row.previousClose != null) {
      if (row.price > row.previousClose) advancers++;
      else if (row.price < row.previousClose) decliners++;
      else unchanged++;
    }

    if (row.dma20 != null) {
      valid20++;
      if (row.price > row.dma20) above20++;
    }
    if (row.dma50 != null) {
      valid50++;
      if (row.price > row.dma50) above50++;
    }
    if (row.dma200 != null) {
      valid200++;
      if (row.price > row.dma200) above200++;
    }

    if (row.volume != null && row.averageVolume20 != null && row.previousClose != null) {
      volumeCandidates++;
      const advancing = row.price > row.previousClose;
      if (advancing) advancingVolume += row.volume;
    }
  }

  const total = valid.length;
  const directionCount = advancers + decliners + unchanged;
  const ratio = decliners > 0 ? advancers / decliners : advancers > 0 ? advancers : null;
  const above20Pct = pct(above20, valid20);
  const above50Pct = pct(above50, valid50);
  const above200Pct = pct(above200, valid200);
  const volumePct = volumeCandidates > 0 ? (advancingVolume > 0 ? pct(
    valid.filter(r => r.previousClose != null && r.price > (r.previousClose as number))
      .reduce((sum, r) => sum + (r.volume ?? 0), 0),
    valid.filter(r => r.volume != null && r.averageVolume20 != null)
      .reduce((sum, r) => sum + (r.volume ?? 0), 0),
  ) : 0) : null;

  const breadthThrust = directionCount > 0 ? (advancers / directionCount) * 100 : null;

  const components: number[] = [];
  if (directionCount > 0) components.push((advancers / directionCount) * 100);
  if (above20Pct != null) components.push(above20Pct);
  if (above50Pct != null) components.push(above50Pct);
  if (above200Pct != null) components.push(above200Pct);
  if (volumePct != null) components.push(volumePct);

  const score = components.length
    ? Math.round((components.reduce((a, b) => a + b, 0) / components.length) * 10) / 10
    : null;

  const coverage = [
    directionCount / total,
    valid20 / total,
    valid50 / total,
    valid200 / total,
    volumeCandidates / total,
  ];
  const confidence = Math.round(clamp(
    coverage.reduce((a, b) => a + b, 0) / coverage.length * 100,
  ));

  return {
    market,
    total,
    advancers,
    decliners,
    unchanged,
    advanceDeclineRatio: ratio,
    above20DmaPercent: above20Pct,
    above50DmaPercent: above50Pct,
    above200DmaPercent: above200Pct,
    volumeAdvancingPercent: volumePct,
    breadthThrust,
    score,
    confidence,
    status: score == null ? "INSUFFICIENT_DATA" : "READY",
    calculatedAt: calculatedAt.toISOString(),
  };
}
