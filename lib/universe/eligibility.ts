export interface EligibilityInput {
  classification: boolean;
  market: boolean;
  stockIntelligence: boolean;
  opportunityContext: boolean;
  expectedReturnPct: number|null;
  score: number|null;
  decision: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  const reasons:string[]=[];
  if(!input.classification) reasons.push("CLASSIFICATION_MISSING");
  if(!input.market) reasons.push("MARKET_DATA_MISSING");
  if(!input.stockIntelligence) reasons.push("STOCK_INTELLIGENCE_MISSING");
  if(!input.opportunityContext) reasons.push("OPPORTUNITY_CONTEXT_MISSING");
  if(input.score===null) reasons.push("SCORE_MISSING");
  if(input.expectedReturnPct===null) reasons.push("EXPECTED_RETURN_MISSING");
  if(input.decision!=="CANDIDATE" && input.decision!=="STRONG_CANDIDATE")
    reasons.push("DECISION_NOT_ELIGIBLE");

  return {eligible: reasons.length===0, reasons};
}
