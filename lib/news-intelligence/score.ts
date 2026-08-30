import type { DangerSignal, NewsEvent, ScoredNewsEvent } from "./types";
import { classifyWithGoogleAI } from "./ai";

const clamp=(n:number)=>Math.max(0,Math.min(100,n));

export async function scoreNewsEventWithAI(event: NewsEvent): Promise<ScoredNewsEvent> {
  const ai = await classifyWithGoogleAI({ headline: event.headline, summary: event.summary });
  if (ai) {
    const newsScore = clamp((ai.sentiment + ai.materiality + (100 - ai.marketImpact)) / 3);
    return {
      ...event,
      sentiment: ai.sentiment,
      materiality: ai.materiality,
      impact: ai.marketImpact,
      newsScore: Math.round(newsScore * 10) / 10,
      riskScore: Math.round(ai.risk * 10) / 10,
      reasons: [ai.category, ai.rationale],
    };
  }

  return {
    ...event,
    sentiment: event.sentiment,
    materiality: event.materiality,
    impact: event.impact,
    newsScore: null,
    riskScore: null,
    reasons: ["AI classification unavailable; event score withheld rather than guessed."],
  };
}

export function aggregateDanger(
  symbol: string | null,
  events: ScoredNewsEvent[],
): DangerSignal {
  const usable = events.filter((event) => event.riskScore !== null);
  if (!usable.length) {
    return {
      symbol,
      scope: symbol ? "STOCK" : "MARKET",
      score: null,
      level: "INSUFFICIENT_DATA",
      reasons: [],
      sourceCount: new Set(events.map((event) => event.provider)).size,
      calculatedAt: new Date().toISOString(),
    };
  }

  const risk = Math.max(...usable.map((event) => event.riskScore as number));
  return {
    symbol,
    scope: symbol ? "STOCK" : "MARKET",
    score: Math.round(risk * 10) / 10,
    level: risk >= 75 ? "HIGH" : risk >= 45 ? "MEDIUM" : "LOW",
    reasons: usable
      .filter((event) => (event.riskScore as number) >= 45)
      .slice(0, 5)
      .flatMap((event) => [event.headline, ...event.reasons]),
    sourceCount: new Set(usable.map((event) => event.provider)).size,
    calculatedAt: new Date().toISOString(),
  };
}
