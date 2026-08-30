import { calculateOpportunity } from "./calculate";
import type { Opportunity } from "./types";
import type { OpportunityProviderContext } from "./providers";
import { deriveReturnModel } from "./return-model";

export function aggregateOpportunity(symbol:string, context:OpportunityProviderContext):Opportunity{
  const returns=deriveReturnModel(context.entry,context.target,context.stopLoss);
  return calculateOpportunity({
    symbol,
    stockScore:context.stockScore,
    stockConfidence:context.stockConfidence,
    marketPulse:context.marketPulse,
    sectorPulse:context.sectorPulse,
    expectedReturnPct:returns.expectedReturnPct,
    downsidePct:returns.downsidePct,
    riskShield:context.riskShield,
    liquidityScore:context.liquidityScore,
  });
}
