export interface SourceEvidence {
  provider: string;
  publishedAt: string | null;
  url: string | null;
  score: number | null;
  reliability: number;
}

const sourceWeights: Record<string, number> = {
  Finnhub: 0.9,
  "Alpha Vantage": 0.85,
  NSE: 0.98,
  BSE: 0.98,
};

export function getSourceReliability(provider: string) {
  return sourceWeights[provider] ?? 0.65;
}

export function reconcileNewsScores(
  evidences: SourceEvidence[],
): { score: number | null; confidence: number; providers: string[] } {
  const valid = evidences.filter(
    (e) => e.score !== null && Number.isFinite(e.score),
  );

  if (!valid.length) {
    return { score: null, confidence: 0, providers: [] };
  }

  const weighted = valid.reduce(
    (acc, evidence) => {
      const weight = getSourceReliability(evidence.provider);
      acc.sum += (evidence.score as number) * weight;
      acc.weight += weight;
      return acc;
    },
    { sum: 0, weight: 0 },
  );

  return {
    score: weighted.weight
      ? Math.round((weighted.sum / weighted.weight) * 10) / 10
      : null,
    confidence: Math.round(
      Math.min(100, valid.length * 25 + (new Set(valid.map((e) => e.provider)).size > 1 ? 25 : 0)),
    ),
    providers: [...new Set(valid.map((e) => e.provider))],
  };
}
