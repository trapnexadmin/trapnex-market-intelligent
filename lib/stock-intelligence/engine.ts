import { calculateStockIntelligenceScore } from "./calculate";
import { calculateFundamentalQuality } from "./factors/fundamental";
import { calculateTechnicalStructure } from "./factors/technical";
import { calculateValuation } from "./factors/valuation";
import { calculateInstitutionalFlow } from "./factors/institutional";
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
}

export function buildStockIntelligence(input: StockIntelligenceInput) {
  return calculateStockIntelligenceScore({
    symbol: input.symbol,
    fundamentalQuality: calculateFundamentalQuality(input.fundamentals),
    technicalStructure: calculateTechnicalStructure(input.candles),
    valuation: calculateValuation(input.valuation),
    institutionalFlow: calculateInstitutionalFlow(input.institutionalFlow),
    sectorAlignment: input.sectorAlignment,
    newsEvent: input.newsEvent,
    riskTrapShield: input.riskTrapShield,
  });
}
