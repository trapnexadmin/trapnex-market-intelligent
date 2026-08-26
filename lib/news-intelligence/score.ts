import type { DangerSignal, NewsEvent } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function scoreNewsEvent(event: NewsEvent) {
  const parts = [event.sentiment, event.materiality, event.impact].filter(
    (v): v is number => v !== null && Number.isFinite(v),
  );

  if (!parts.length) return null;
  return Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 10) / 10;
}

export function calculateDangerSignal(
  symbol: string | null,
  events: NewsEvent[],
): DangerSignal {
  const relevant = events.filter((event) => !symbol || event.symbol === symbol);
  if (!relevant.length) {
    return {
      symbol,
      scope: symbol ? "STOCK" : "MARKET",
      score: null,
      level: "INSUFFICIENT_DATA",
      reasons: [],
      sourceCount: 0,
      calculatedAt: new Date().toISOString(),
    };
  }

  const scores = relevant
    .map(scoreNewsEvent)
    .filter((v): v is number => v !== null);

  if (!scores.length) {
    return {
      symbol,
      scope: symbol ? "STOCK" : "MARKET",
      score: null,
      level: "INSUFFICIENT_DATA",
      reasons: ["News exists, but no scored impact/materiality inputs are available."],
      sourceCount: new Set(relevant.map((event) => event.provider)).size,
      calculatedAt: new Date().toISOString(),
    };
  }

  const score = clamp(Math.max(...scores));
  const level = score >= 75 ? "HIGH" : score >= 45 ? "MEDIUM" : "LOW";

  return {
    symbol,
    scope: symbol ? "STOCK" : "MARKET",
    score,
    level,
    reasons: relevant
      .slice(0, 5)
      .map((event) => event.headline)
      .filter(Boolean),
    sourceCount: new Set(relevant.map((event) => event.provider)).size,
    calculatedAt: new Date().toISOString(),
  };
}
