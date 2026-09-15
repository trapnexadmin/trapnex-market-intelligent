import type { StockFactorInput } from "./types";

export interface MarketRegimeContext {
  marketPulse: number | null;
  capPulse: number | null;
  sectorPulse: number | null;
  combinedPulse: number | null;
  ready: boolean;
  provenance: {
    calculatedAt: string;
    classificationCount: number;
  };
}

const clamp=(n:number)=>Math.max(0,Math.min(100,n));

export function applyMarketRegimeToStockFactors(
  input: StockFactorInput,
  context: MarketRegimeContext,
): StockFactorInput {
  const values = [context.marketPulse, context.capPulse, context.sectorPulse]
    .filter((v): v is number => v !== null && Number.isFinite(v));
  if (!values.length) return input;

  const combinedPulse = clamp(values.reduce((a,b)=>a+b,0)/values.length);
  return {
    ...input,
    sectorAlignment: input.sectorAlignment === null
      ? combinedPulse
      : clamp((input.sectorAlignment * 0.7) + (combinedPulse * 0.3)),
  };
}
