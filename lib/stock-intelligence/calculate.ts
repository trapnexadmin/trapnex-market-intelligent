import type { StockFactorInput, StockIntelligenceScore } from "./types";

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const definitions: Array<
  [keyof Omit<StockFactorInput, "symbol">, string, number]
> = [
  ["fundamentalQuality", "Fundamental Quality", 0.25],
  ["technicalStructure", "Technical Structure", 0.2],
  ["valuation", "Valuation", 0.1],
  ["institutionalFlow", "Institutional Flow", 0.15],
  ["sectorAlignment", "Sector Alignment", 0.1],
  ["newsEvent", "News / Event", 0.1],
  ["riskTrapShield", "Risk / Trap Shield", 0.1],
];

export function calculateStockIntelligenceScore(
  input: StockFactorInput,
  calculatedAt = new Date(),
): StockIntelligenceScore {
  const factors = definitions.map(([key, label, weight]) => {
    const raw = input[key];
    const score =
      raw === null || raw === undefined || !Number.isFinite(raw)
        ? null
        : clamp(raw);

    return {
      key,
      label,
      weight,
      score,
      status: score === null ? ("MISSING" as const) : ("READY" as const),
    };
  });

  const ready = factors.filter((factor) => factor.score !== null);
  const weight = ready.reduce((sum, factor) => sum + factor.weight, 0);

  const score =
    weight > 0
      ? clamp(
          ready.reduce(
            (sum, factor) => sum + (factor.score as number) * factor.weight,
            0,
          ) / weight,
        )
      : null;

  return {
    symbol: input.symbol,
    score: score === null ? null : Math.round(score * 10) / 10,
    status: score === null ? "INSUFFICIENT_DATA" : "READY",
    confidence: Math.round(weight * 100),
    factors,
    calculatedAt: calculatedAt.toISOString(),
  };
}
