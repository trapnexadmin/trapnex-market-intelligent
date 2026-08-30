export type OpportunityDecision="STRONG_CANDIDATE"|"CANDIDATE"|"WATCH"|"AVOID"|"INSUFFICIENT_DATA";

export interface OpportunityInput{
  symbol:string;
  stockScore:number|null;
  stockConfidence:number;
  marketPulse:number|null;
  sectorPulse:number|null;
  expectedReturnPct:number|null;
  downsidePct:number|null;
  riskShield:number|null;
  liquidityScore:number|null;
}

export interface Opportunity{
  symbol:string;
  score:number|null;
  expectedReturnPct:number|null;
  downsidePct:number|null;
  riskReward:number|null;
  decision:OpportunityDecision;
  confidence:number;
  reasons:string[];
  calculatedAt:string;
}
