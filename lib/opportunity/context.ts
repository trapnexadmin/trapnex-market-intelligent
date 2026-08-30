import { calculateStockIntelligenceScore } from "@/lib/stock-intelligence/calculate";
import type { StockFactorInput } from "@/lib/stock-intelligence/types";
import type { OpportunityInput } from "./types";

export interface OpportunityContext {
  stock: StockFactorInput;
  marketPulse: number | null;
  sectorPulse: number | null;
  riskShield: number | null;
  liquidityScore: number | null;
  entry: number | null;
  target: number | null;
  stopLoss: number | null;
}

const pct=(entry:number|null,value:number|null)=>{
  if(entry===null||value===null||entry<=0) return null;
  return ((value-entry)/entry)*100;
};

export function buildOpportunityContext(
  stock: StockFactorInput,
  marketPulse:number|null,
  sectorPulse:number|null,
  riskShield:number|null,
  liquidityScore:number|null,
  entry:number|null,
  target:number|null,
  stopLoss:number|null,
):OpportunityInput{
  const intelligence=calculateStockIntelligenceScore(stock);
  return {
    symbol:stock.symbol,
    stockScore:intelligence.score,
    stockConfidence:intelligence.confidence,
    marketPulse,
    sectorPulse,
    riskShield,
    liquidityScore,
    expectedReturnPct:pct(entry,target),
    downsidePct:entry!==null&&stopLoss!==null&&entry>0
      ? Math.abs(pct(entry,stopLoss) ?? 0)
      : null,
  };
}
