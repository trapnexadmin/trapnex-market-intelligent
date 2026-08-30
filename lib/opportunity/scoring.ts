import type { OpportunityInput } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export interface OpportunityContext {
  stockScore: number | null;
  stockConfidence: number;
  marketPulse: number | null;
  sectorPulse: number | null;
  riskShield: number | null;
  liquidityScore: number | null;
  expectedReturnPct: number | null;
  downsidePct: number | null;
}

export function calculateOpportunityScore(input: OpportunityContext) {
  const values = [
    input.stockScore,
    input.marketPulse,
    input.sectorPulse,
    input.riskShield,
    input.liquidityScore,
    input.expectedReturnPct === null ? null : clamp(input.expectedReturnPct * 5),
  ].filter((v): v is number => v !== null && Number.isFinite(v));

  if (!values.length) return null;
  return Math.round(
    clamp(values.reduce((sum, value) => sum + value, 0) / values.length) * 10,
  ) / 10;
}

export function buildOpportunityInput(
  symbol: string,
  context: OpportunityContext,
): OpportunityInput {
  return { symbol, ...context };
}
