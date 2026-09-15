import type { Opportunity } from "./types";

export interface OpportunityDiagnostics {
  scoreComplete: boolean;
  marketContextComplete: boolean;
  technicalPlanComplete: boolean;
  decisionEligible: boolean;
  missing: string[];
}

export function diagnoseOpportunity(
  opportunity: Opportunity | null,
  context: {
    marketPulse: number | null;
    sectorPulse: number | null;
    entry: number | null;
    target: number | null;
    stopLoss: number | null;
  },
): OpportunityDiagnostics {
  const missing:string[]=[];
  if(context.marketPulse===null) missing.push("MARKET_PULSE");
  if(context.sectorPulse===null) missing.push("SECTOR_PULSE");
  if(context.entry===null) missing.push("ENTRY");
  if(context.target===null) missing.push("TARGET");
  if(context.stopLoss===null) missing.push("STOP_LOSS");

  return {
    scoreComplete: opportunity?.score !== null && opportunity?.score !== undefined,
    marketContextComplete: context.marketPulse !== null && context.sectorPulse !== null,
    technicalPlanComplete: context.entry !== null && context.target !== null && context.stopLoss !== null,
    decisionEligible: opportunity?.decision === "CANDIDATE" || opportunity?.decision === "STRONG_CANDIDATE",
    missing,
  };
}
