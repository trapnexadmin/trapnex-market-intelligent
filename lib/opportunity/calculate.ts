import type { Opportunity, OpportunityInput } from "./types";

const clamp=(n:number)=>Math.max(0,Math.min(100,n));

export function calculateOpportunity(input: OpportunityInput, calculatedAt=new Date()): Opportunity {
  const reasons:string[]=[];

  if ((input.expectedReturnPct ?? 0) >= 10) reasons.push("Expected return meets the 10% screening threshold.");
  else reasons.push("Expected return is below the 10% screening threshold.");

  if (input.stockScore !== null && input.stockScore >= 75) reasons.push("Stock intelligence is strong.");
  if (input.marketPulse !== null && input.marketPulse >= 60) reasons.push("Market regime supports long exposure.");
  if (input.sectorPulse !== null && input.sectorPulse >= 60) reasons.push("Sector strength is supportive.");
  if (input.riskShield !== null && input.riskShield >= 60) reasons.push("Risk shield is supportive.");

  const rr =
    input.expectedReturnPct !== null &&
    input.downsidePct !== null &&
    input.downsidePct > 0
      ? input.expectedReturnPct / input.downsidePct
      : null;

  const components = [
    input.stockScore,
    input.marketPulse,
    input.sectorPulse,
    input.riskShield,
    input.liquidityScore,
    input.expectedReturnPct === null ? null : clamp(input.expectedReturnPct * 5),
  ].filter((v): v is number => v !== null && Number.isFinite(v));

  const score = components.length
    ? Math.round((components.reduce((a,b)=>a+b,0)/components.length)*10)/10
    : null;

  let decision: Opportunity["decision"] = "INSUFFICIENT_DATA";
  if (score !== null) {
    if ((input.expectedReturnPct ?? 0) >= 10 && score >= 75 && (rr === null || rr >= 1.5)) {
      decision="STRONG_CANDIDATE";
    } else if ((input.expectedReturnPct ?? 0) >= 10 && score >= 60) {
      decision="CANDIDATE";
    } else if (score >= 45) {
      decision="WATCH";
    } else {
      decision="AVOID";
    }
  }

  return {
    symbol: input.symbol,
    score,
    expectedReturnPct: input.expectedReturnPct,
    downsidePct: input.downsidePct,
    riskReward: rr,
    decision,
    confidence: Math.round(((components.length + (input.stockConfidence > 0 ? 1 : 0)) / 7) * 100),
    reasons,
    calculatedAt: calculatedAt.toISOString(),
  };
}
