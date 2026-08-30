import type { DangerSignal, NewsEvent, ScoredNewsEvent } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

const negativeKeywords = [
  "fraud", "scam", "default", "downgrade", "probe", "investigation",
  "penalty", "regulatory", "lawsuit", "resign", "resignation", "warning",
  "fraudulent", "accounting", "debt", "fire", "cyberattack", "ban", "recall",
  "decline",
];

const positiveKeywords = [
  "order", "contract", "approval", "upgrade", "profit", "growth",
  "partnership", "acquisition", "launch", "expansion", "record", "strong",
  "dividend",
];

export function inferNewsFeatures(event: NewsEvent) {
  const text = `${event.headline} ${event.summary ?? ""}`.toLowerCase();
  let sentiment = 50;
  let materiality = 35;

  for (const word of negativeKeywords) {
    if (text.includes(word)) {
      sentiment -= 10;
      materiality += 8;
    }
  }

  for (const word of positiveKeywords) {
    if (text.includes(word)) sentiment += 7;
  }

  if (event.publishedAt) {
    const published = new Date(event.publishedAt).getTime();
    const ageHours = (Date.now() - published) / 3600000;
    if (Number.isFinite(ageHours) && ageHours <= 24) materiality += 8;
    else if (Number.isFinite(ageHours) && ageHours > 72) materiality -= 10;
  }

  return {
    sentiment: clamp(sentiment),
    materiality: clamp(materiality),
  };
}

export function scoreNewsEvent(event: NewsEvent): ScoredNewsEvent {
  const inferred = inferNewsFeatures(event);
  const sentiment = event.sentiment ?? inferred.sentiment;
  const materiality = event.materiality ?? inferred.materiality;
  const impact = event.impact ?? (100 - sentiment) * 0.65 + materiality * 0.35;

  const newsScore = clamp((sentiment + materiality + (100 - impact)) / 3);
  const riskScore = clamp((impact + (100 - sentiment)) / 2);

  return {
    ...event,
    sentiment,
    materiality,
    impact,
    newsScore: Math.round(newsScore * 10) / 10,
    riskScore: Math.round(riskScore * 10) / 10,
    reasons: [
      riskScore >= 70
        ? "High negative-impact language or event materiality."
        : "No high-severity negative signal detected.",
    ],
  };
}

export function calculateDangerSignal(
  symbol: string | null,
  events: NewsEvent[],
): DangerSignal {
  const scored = events.map(scoreNewsEvent);

  if (!scored.length) {
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

  const highest = Math.max(...scored.map((event) => event.riskScore ?? 0));
  const level = highest >= 75 ? "HIGH" : highest >= 45 ? "MEDIUM" : "LOW";

  return {
    symbol,
    scope: symbol ? "STOCK" : "MARKET",
    score: Math.round(highest * 10) / 10,
    level,
    reasons: scored
      .filter((event) => (event.riskScore ?? 0) >= 45)
      .slice(0, 5)
      .flatMap((event) => [event.headline, ...event.reasons]),
    sourceCount: new Set(scored.map((event) => event.provider)).size,
    calculatedAt: new Date().toISOString(),
  };
}
