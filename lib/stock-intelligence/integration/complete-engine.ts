import { buildStockIntelligence } from "../engine";
import { calculateRiskTrapShield } from "../risk-trap-shield";
import {
  EMPTY_FUNDAMENTALS,
  EMPTY_INSTITUTIONAL_FLOW,
  EMPTY_VALUATION,
} from "./default-inputs";
import { calculateDataQuality } from "./data-quality";
import { loadValidatedQuote } from "./market-loader";
import { loadHistoricalCandles } from "./historical-loader";
import { resolveFundamentals } from "@/lib/providers/fundamentals/registry";
import { resolveInstitutionalFlow } from "@/lib/providers/institutional/registry";
import { getCompanyCorporateActions, corporateActionRisk } from "@/lib/news-intelligence/corporate-actions";
import { getUniverseSymbol } from "@/lib/universe/registry";
import { ensureUniverseLoaded } from "@/lib/universe/bootstrap";

export interface CompleteStockIntelligenceOptions {
  marketPulse?: number | null;
  capPulse?: number | null;
  sectorPulse?: number | null;
}

export async function buildCompleteStockIntelligence(
  symbol: string,
  options: CompleteStockIntelligenceOptions = {},
) {
  await ensureUniverseLoaded();
  const identity = getUniverseSymbol(symbol, "NSE");

  const [live, history, fundamentalsResult, institutionalResult, corporateActions] =
    await Promise.all([
      loadValidatedQuote(symbol),
      loadHistoricalCandles(symbol, {
        interval: "ONE_DAY",
        days: 120,
      }),
      identity?.isin
        ? resolveFundamentals({ symbol, isin: identity.isin })
        : Promise.resolve({
            provider: null,
            asOf: null,
            fundamentals: null,
            valuation: null,
            institutionalFlow: null,
            errors: ["ISIN_MISSING"],
          }),
      resolveInstitutionalFlow(symbol),
      getCompanyCorporateActions(symbol).catch(() => []),
    ]);

  const fundamentals =
    fundamentalsResult.fundamentals ?? EMPTY_FUNDAMENTALS;
  const valuation =
    fundamentalsResult.valuation ?? EMPTY_VALUATION;
  const institutionalFlow =
    institutionalResult.snapshot ??
    fundamentalsResult.institutionalFlow ??
    EMPTY_INSTITUTIONAL_FLOW;

  const actionRisk = corporateActionRisk(corporateActions);

  const baseRiskShield = calculateRiskTrapShield({
    dangerScore: null,
    leverageRisk: null,
    governanceRisk: null,
    liquidityRisk: null,
    abnormalPriceVolume: null,
  });

  const combinedRiskShield =
    baseRiskShield === null && actionRisk === null
      ? null
      : Math.max(
          0,
          Math.min(
            100,
            (baseRiskShield ?? 100) * 0.85 +
              (100 - (actionRisk ?? 0)) * 0.15,
          ),
        );

  const result = buildStockIntelligence({
    symbol,
    candles: history.candles,
    fundamentals,
    valuation,
    institutionalFlow,
    sectorAlignment: options.sectorPulse ?? null,
    newsEvent: null,
    riskTrapShield: combinedRiskShield,
    marketRegime: {
      marketPulse: options.marketPulse ?? null,
      capPulse: options.capPulse ?? null,
      sectorPulse: options.sectorPulse ?? null,
      combinedPulse: null,
      ready:
        options.marketPulse !== null ||
        options.capPulse !== null ||
        options.sectorPulse !== null,
      provenance: {
        calculatedAt: new Date().toISOString(),
        classificationCount: 0,
      },
    },
  });

  const errors = [
    ...live.errors,
    ...history.errors,
    ...fundamentalsResult.errors,
    ...institutionalResult.errors,
  ];

  const dataCompleteness = {
    quote: live.quote !== null,
    historicalCandles: history.candles.length >= 50,
    fundamentals: fundamentalsResult.fundamentals !== null,
    valuation: fundamentalsResult.valuation !== null,
    institutionalFlow:
      institutionalResult.snapshot !== null ||
      fundamentalsResult.institutionalFlow !== null,
    corporateActions: corporateActions.length > 0,
  };

  const providerQuality = {
    quote: live.provider !== null,
    historical: history.provider !== null,
    fundamentals: fundamentalsResult.provider !== null,
    institutional: institutionalResult.provider !== null,
    corporateActions: corporateActions.length > 0,
  };

  const dataQuality = calculateDataQuality({
    score: result,
    providerQuality,
  });

  return {
    ...result,
    quote: live.quote,
    candles: history.candles,
    marketDataProvider: live.provider,
    historicalProvider: history.provider,
    fundamentalProvider: fundamentalsResult.provider,
    institutionalProvider: institutionalResult.provider ?? null,
    instrumentToken: history.instrumentToken,
    corporateActionCount: corporateActions.length,
    corporateActionRisk: actionRisk,
    dataQuality,
    errors,
    dataCompleteness,
    providerQuality,
  };
}
