import type { StockIntelligenceScore } from "../types";

export interface DataQualityResult {
  qualityScore: number;
  completenessPct: number;
  readyFactors: number;
  totalFactors: number;
  providerCount: number;
}

export function calculateDataQuality(input: {
  score: Pick<StockIntelligenceScore, "factors">;
  providerQuality: Record<string, boolean>;
}): DataQualityResult {
  const totalFactors = input.score.factors.length;
  const readyFactors = input.score.factors.filter(
    (factor) => factor.score !== null,
  ).length;

  const completenessPct = totalFactors
    ? Math.round((readyFactors / totalFactors) * 100)
    : 0;

  const providerValues = Object.values(input.providerQuality);
  const providerCount = providerValues.filter(Boolean).length;

  const providerCoverage = providerValues.length
    ? (providerCount / providerValues.length) * 100
    : 0;

  const qualityScore = Math.round(
    (completenessPct * 0.7 + providerCoverage * 0.3) * 10,
  ) / 10;

  return {
    qualityScore,
    completenessPct,
    readyFactors,
    totalFactors,
    providerCount,
  };
}
