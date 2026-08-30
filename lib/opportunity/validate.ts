import type { OpportunityInput } from "./types";

export function hasMinimumOpportunityInputs(input: OpportunityInput) {
  return (
    input.symbol.length > 0 &&
    input.stockScore !== null &&
    input.stockConfidence >= 50 &&
    input.marketPulse !== null &&
    input.sectorPulse !== null &&
    input.expectedReturnPct !== null &&
    input.downsidePct !== null &&
    input.riskShield !== null
  );
}
