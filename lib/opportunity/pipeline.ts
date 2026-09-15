import { buildStockIntelligence, type StockIntelligenceInput } from "@/lib/stock-intelligence/engine";
import { calculateOpportunity } from "./calculate";
import { deriveReturnModel } from "./return-model";

export interface OpportunityPipelineInput {
  stock: StockIntelligenceInput;
  marketPulse: number | null;
  sectorPulse: number | null;
  capPulse: number | null;
  entry: number | null;
  target: number | null;
  stopLoss: number | null;
  riskShield: number | null;
  liquidityScore: number | null;
}

export function buildOpportunityPipeline(input: OpportunityPipelineInput) {
  const stock = buildStockIntelligence({
    ...input.stock,
    marketRegime: {
      marketPulse: input.marketPulse,
      capPulse: input.capPulse,
      sectorPulse: input.sectorPulse,
      combinedPulse: null,
      ready: input.marketPulse !== null || input.capPulse !== null || input.sectorPulse !== null,
      provenance: {
        calculatedAt: new Date().toISOString(),
        classificationCount: 0,
      },
    },
  });

  const returns = deriveReturnModel(input.entry, input.target, input.stopLoss);

  const opportunity = calculateOpportunity({
    symbol: input.stock.symbol,
    stockScore: stock.score,
    stockConfidence: stock.confidence,
    marketPulse: input.marketPulse,
    sectorPulse: input.sectorPulse,
    expectedReturnPct: returns.expectedReturnPct,
    downsidePct: returns.downsidePct,
    riskShield: input.riskShield,
    liquidityScore: input.liquidityScore,
  });

  return {
    stock,
    opportunity,
    context: {
      marketPulse: input.marketPulse,
      capPulse: input.capPulse,
      sectorPulse: input.sectorPulse,
      entry: input.entry,
      target: input.target,
      stopLoss: input.stopLoss,
    },
  };
}
