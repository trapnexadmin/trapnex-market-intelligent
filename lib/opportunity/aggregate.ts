import { calculateOpportunity } from "./calculate";
import type { Opportunity } from "./types";
import type { ProviderContext } from "./provider-adapters";
import { buildTechnicalPlan } from "./technical-plan";
import { deriveReturnModel } from "./return-model";

export function aggregateProviderContext(
  symbol: string,
  context: ProviderContext,
  candles: { high: number; low: number; close: number }[] = [],
): Opportunity {
  const plan =
    context.entry !== null &&
    context.target !== null &&
    context.stopLoss !== null
      ? {
          entry: context.entry,
          target: context.target,
          stopLoss: context.stopLoss,
        }
      : buildTechnicalPlan(candles);

  const returns = deriveReturnModel(
    plan.entry,
    plan.target,
    plan.stopLoss,
  );

  return calculateOpportunity({
    symbol,
    stockScore: context.stockScore,
    stockConfidence: context.stockConfidence,
    marketPulse: context.marketPulse,
    sectorPulse: context.sectorPulse,
    expectedReturnPct: returns.expectedReturnPct,
    downsidePct: returns.downsidePct,
    riskShield: context.riskShield,
    liquidityScore: context.liquidityScore,
  });
}
