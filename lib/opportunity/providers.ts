export interface OpportunityProviderContext {
  stockScore:number|null;
  stockConfidence:number;
  marketPulse:number|null;
  sectorPulse:number|null;
  riskShield:number|null;
  liquidityScore:number|null;
  entry:number|null;
  target:number|null;
  stopLoss:number|null;
  sources:string[];
  errors:string[];
}

export function emptyOpportunityContext():OpportunityProviderContext{
  return {
    stockScore:null,
    stockConfidence:0,
    marketPulse:null,
    sectorPulse:null,
    riskShield:null,
    liquidityScore:null,
    entry:null,
    target:null,
    stopLoss:null,
    sources:[],
    errors:[],
  };
}
