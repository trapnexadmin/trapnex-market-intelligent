import { buildStockIntelligence } from "../engine";
import { calculateRiskTrapShield } from "../risk-trap-shield";
import { EMPTY_FUNDAMENTALS, EMPTY_INSTITUTIONAL_FLOW, EMPTY_VALUATION } from "./default-inputs";
import { loadValidatedQuote } from "./market-loader";

export async function buildLiveStockIntelligence(symbol: string, context?: {
  sectorAlignment?: number | null;
  newsEvent?: number | null;
  dangerScore?: number | null;
  leverageRisk?: number | null;
  governanceRisk?: number | null;
  liquidityRisk?: number | null;
  abnormalPriceVolume?: number | null;
  marketPulse?: number | null;
  capPulse?: number | null;
  sectorPulse?: number | null;
}) {
  const live = await loadValidatedQuote(symbol);
  const riskTrapShield = calculateRiskTrapShield({
    dangerScore: context?.dangerScore ?? null,
    leverageRisk: context?.leverageRisk ?? null,
    governanceRisk: context?.governanceRisk ?? null,
    liquidityRisk: context?.liquidityRisk ?? null,
    abnormalPriceVolume: context?.abnormalPriceVolume ?? null,
  });
  const marketRegime = {
    marketPulse: context?.marketPulse ?? null,
    capPulse: context?.capPulse ?? null,
    sectorPulse: context?.sectorPulse ?? null,
    combinedPulse: null,
    ready: (context?.marketPulse ?? null) !== null || (context?.capPulse ?? null) !== null || (context?.sectorPulse ?? null) !== null,
    provenance: { calculatedAt: new Date().toISOString(), classificationCount: 0 },
  };
  const result = buildStockIntelligence({
    symbol,
    candles: live.candle ? [live.candle] : [],
    fundamentals: EMPTY_FUNDAMENTALS,
    valuation: EMPTY_VALUATION,
    institutionalFlow: EMPTY_INSTITUTIONAL_FLOW,
    sectorAlignment: context?.sectorAlignment ?? null,
    newsEvent: context?.newsEvent ?? null,
    riskTrapShield,
    marketRegime,
  });
  return { ...result, quote: live.quote, provider: live.provider, fallbackUsed: live.fallbackUsed, errors: live.errors };
}
