export interface ProviderQuote {
  symbol:string;
  price:number|null;
  changePct:number|null;
  volume:number|null;
  provider:string;
  asOf:string|null;
}

export interface ProviderContext {
  quote:ProviderQuote|null;
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

export function normalizeQuote(input:Partial<ProviderQuote>,provider:string):ProviderQuote{
  return {
    symbol:String(input.symbol??"").toUpperCase(),
    price:typeof input.price==="number"&&Number.isFinite(input.price)?input.price:null,
    changePct:typeof input.changePct==="number"&&Number.isFinite(input.changePct)?input.changePct:null,
    volume:typeof input.volume==="number"&&Number.isFinite(input.volume)?input.volume:null,
    provider,
    asOf:input.asOf??null,
  };
}
