import { calculateStockIntelligenceScore } from "@/lib/stock-intelligence/calculate";
import type { StockFactorInput } from "@/lib/stock-intelligence/types";

export interface FinalOpportunitySignals {
  symbol:string;
  stockScore:number|null;
  stockConfidence:number;
  marketPulse:number|null;
  sectorPulse:number|null;
  riskShield:number|null;
  liquidityScore:number|null;
  entry:number|null;
  stopLoss:number|null;
  target:number|null;
  expectedReturnPct:number|null;
  downsidePct:number|null;
  riskReward:number|null;
  sources:string[];
  errors:string[];
}

export function buildFinalSignals(
  stock:StockFactorInput,
  extras:Omit<FinalOpportunitySignals,
    "symbol"|"stockScore"|"stockConfidence">,
):FinalOpportunitySignals{
  const intelligence=calculateStockIntelligenceScore(stock);
  return {
    ...extras,
    symbol:stock.symbol,
    stockScore:intelligence.score,
    stockConfidence:intelligence.confidence,
  };
}
