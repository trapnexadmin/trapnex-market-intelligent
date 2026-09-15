import { calculateStockIntelligenceScore } from "./calculate";
import { calculateFundamentalQuality } from "./factors/fundamental";
import { calculateTechnicalStructure } from "./factors/technical";
import { calculateValuation } from "./factors/valuation";
import { calculateInstitutionalFlow } from "./factors/institutional";
import { applyMarketRegimeToStockFactors, type MarketRegimeContext } from "./market-context";
import type {
  Candle,
  FundamentalSnapshot,
  InstitutionalFlowSnapshot,
  ValuationSnapshot,
} from "./factors/types";

export interface StockIntelligenceInput {
  symbol: string;
  candles: Candle[];
  fundamentals: FundamentalSnapshot;
  valuation: ValuationSnapshot;
  institutionalFlow: InstitutionalFlowSnapshot;
  sectorAlignment: number | null;
  newsEvent: number | null;
  riskTrapShield: number | null;
  marketRegime?: MarketRegimeContext;
}

export function buildStockIntelligence(input: StockIntelligenceInput) {
  const raw = {
    symbol: input.symbol,
    fundamentalQuality: calculateFundamentalQuality(input.fundamentals),
    technicalStructure: calculateTechnicalStructure(input.candles),
    valuation: calculateValuation(input.valuation),
    institutionalFlow: calculateInstitutionalFlow(input.institutionalFlow),
    sectorAlignment: input.sectorAlignment,
    newsEvent: input.newsEvent,
    riskTrapShield: input.riskTrapShield,
  };

  const factors = input.marketRegime
    ? applyMarketRegimeToStockFactors(raw, input.marketRegime)
    : raw;

  return calculateStockIntelligenceScore(factors);
}
