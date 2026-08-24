import type { BreadthSnapshot, MarketDirection, MarketSnapshot, PulseFactor, TrendPulse } from './types';

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const now = () => new Date();

function trendScore(snapshots: MarketSnapshot[]): number | null {
  const usable = snapshots.filter((s) => Number.isFinite(s.price) && Number.isFinite(s.previousClose));
  if (!usable.length) return null;
  const avgReturn = usable.reduce((sum, s) => sum + ((s.price - (s.previousClose as number)) / (s.previousClose as number)) * 100, 0) / usable.length;
  return clamp(50 + avgReturn * 20);
}

function breadthScore(breadth?: BreadthSnapshot): number | null {
  if (!breadth || breadth.total <= 0) return null;
  return clamp((breadth.advancers / breadth.total) * 100);
}

function momentumScore(snapshots: MarketSnapshot[]): number | null {
  const changes = snapshots
    .filter((s) => Number.isFinite(s.price) && Number.isFinite(s.previousClose) && (s.previousClose as number) > 0)
    .map((s) => ((s.price - (s.previousClose as number)) / (s.previousClose as number)) * 100);
  if (!changes.length) return null;
  const positive = changes.filter((x) => x > 0).length / changes.length;
  return clamp(positive * 100);
}

function volumeScore(snapshots: MarketSnapshot[]): number | null {
  const volumes = snapshots
    .map((s) => s.volume)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0);
  if (!volumes.length) return null;
  const mean = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  if (mean <= 0) return null;
  const active = volumes.filter((v) => v >= mean).length / volumes.length;
  return clamp(active * 100);
}

function direction(score: number | null): MarketDirection {
  if (score === null) return 'INSUFFICIENT_DATA';
  if (score >= 65) return 'BULLISH';
  if (score <= 35) return 'BEARISH';
  return 'NEUTRAL';
}

export function calculateTrendPulse(input: {
  snapshots: MarketSnapshot[];
  breadth?: BreadthSnapshot;
  newsScore?: number;
  riskScore?: number;
  calculatedAt?: Date;
}): TrendPulse {
  const calculatedAt = input.calculatedAt ?? now();
  const definitions: Array<[string, string, number, number | null]> = [
    ['trend', 'Trend', 0.20, trendScore(input.snapshots)],
    ['breadth', 'Breadth', 0.15, breadthScore(input.breadth)],
    ['momentum', 'Momentum', 0.15, momentumScore(input.snapshots)],
    ['volume', 'Volume', 0.10, volumeScore(input.snapshots)],
    ['relative_strength', 'Relative Strength', 0.15, trendScore(input.snapshots)],
    ['news', 'News', 0.10, input.newsScore ?? null],
    ['risk', 'Risk Regime', 0.15, input.riskScore ?? null],
  ];

  const factors: PulseFactor[] = definitions.map(([key, label, weight, score]) => ({
    key, label, weight, score, status: score === null ? 'MISSING' : 'READY',
  }));

  const ready = factors.filter((f) => f.score !== null);
  const weight = ready.reduce((sum, f) => sum + f.weight, 0);
  const score = weight > 0 ? ready.reduce((sum, f) => sum + (f.score as number) * f.weight, 0) / weight : null;
  const freshness = input.snapshots.length
    ? Math.max(0, Math.round((calculatedAt.getTime() - Math.max(...input.snapshots.map((s) => new Date(s.timestamp).getTime()))) / 1000))
    : null;

  return {
    score: score === null ? null : Math.round(score * 10) / 10,
    direction: direction(score),
    confidence: Math.round((weight / 1) * 100),
    factors,
    calculatedAt: calculatedAt.toISOString(),
    dataFreshnessSeconds: freshness,
    sourceCount: new Set(input.snapshots.map((s) => `${s.exchange}:${s.symbol}`)).size,
  };
}
