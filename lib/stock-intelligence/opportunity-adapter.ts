import type { OpportunityInput } from "@/lib/opportunity/types";

export interface VerifiedOpportunityContext {
  stockScore:number|null;
  stockConfidence:number;
  marketPulse:number|null;
  sectorPulse:number|null;
  riskShield:number|null;
  liquidityScore:number|null;
  expectedReturnPct:number|null;
  downsidePct:number|null;
}

export function toOpportunityInput(symbol:string, context:VerifiedOpportunityContext):OpportunityInput{
  return {symbol,...context};
}
