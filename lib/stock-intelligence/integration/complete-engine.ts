import { buildStockIntelligence } from "../engine";
import { calculateRiskTrapShield } from "../risk-trap-shield";
import {
  EMPTY_FUNDAMENTALS,
  EMPTY_INSTITUTIONAL_FLOW,
  EMPTY_VALUATION,
} from "./default-inputs";
import { assessHistoricalQuality } from "./historical-quality";
import { calculateDataQuality } from "./data-quality";
import { loadValidatedQuote } from "./market-loader";
import { loadHistoricalCandles } from "./historical-loader";
import { loadStockNewsContext } from "./news-loader";
import { getMarketNewsRiskShield } from "./market-news-risk";
import { resolveFundamentals } from "@/lib/providers/fundamentals/registry";
import { resolveInstitutionalFlow } from "@/lib/providers/institutional/registry";
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

  const [
    live,
    history,
    fundamentalsResult,
    institutionalResult,
    newsContext,
    marketNewsRisk,
  ] = await Promise.all([
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
    loadStockNewsContext(symbol),
    getMarketNewsRiskShield(),
  ]);

  const fundamentals =
    fundamentalsResult.fundamentals ?? EMPTY_FUNDAMENTALS;
  const valuation =
    fundamentalsResult.valuation ?? EMPTY_VALUATION;
  const institutionalFlow =
    institutionalResult.snapshot ??
    fundamentalsResult.institutionalFlow ??
    EMPTY_INSTITUTIONAL_FLOW;

  const stockBaseRisk = calculateRiskTrapShield({
    dangerScore: newsContext.dangerScore,
    leverageRisk: null,
    governanceRisk: null,
    liquidityRisk: null,
    abnormalPriceVolume: null,
  });

  const localRisk = newsContext.corporateActionRisk;
  const marketRiskShield = marketNewsRisk.shield;

  const localShield =
    stockBaseRisk === null && localRisk === null
      ? null
      : Math.max(
          0,
          Math.min(
            100,
            (stockBaseRisk ?? 100) * 0.85 +
              (100 - (localRisk ?? 0)) * 0.15,
          ),
        );

  const riskTrapShield =
    localShield === null && marketRiskShield === null
      ? null
      : Math.max(
          0,
          Math.min(
            100,
            (localShield ?? 100) * 0.8 +
              (marketRiskShield ?? 100) * 0.2,
          ),
        );

  const result = buildStockIntelligence({
    symbol,
    candles: history.candles,
    fundamentals,
    valuation,
    institutionalFlow,
    sectorAlignment: options.sectorPulse ?? null,
    newsEvent: newsContext.dangerScore,
    riskTrapShield,
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
    ...newsContext.errors,
    ...marketNewsRisk.context.errors,
  ];

  const dataCompleteness = {
    quote: live.quote !== null,
    historicalCandles: history.candles.length >= 50,
    fundamentals: fundamentalsResult.fundamentals !== null,
    valuation: fundamentalsResult.valuation !== null,
    institutionalFlow:
      institutionalResult.snapshot !== null ||
      fundamentalsResult.institutionalFlow !== null,
    newsEvents: newsContext.events.length > 0,
    corporateActions: newsContext.corporateActions.length > 0,
    globalMarketNews: marketNewsRisk.context.globalDanger !== null,
    indiaMarketNews: marketNewsRisk.context.indiaDanger !== null,
  };

  const providerQuality = {
    quote: live.provider !== null,
    historical: history.provider !== null,
    fundamentals: fundamentalsResult.provider !== null,
    institutional: institutionalResult.provider !== null,
    news: newsContext.provider !== null,
  };

  const historicalQuality = assessHistoricalQuality(history.candles);

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
    newsProvider: newsContext.provider,
    instrumentToken: history.instrumentToken,
    newsEvents: newsContext.events,
    dangerScore: newsContext.dangerScore,
    corporateActions: newsContext.corporateActions,
    corporateActionRisk: newsContext.corporateActionRisk,
    marketNews: marketNewsRisk.context,
    marketNewsRiskShield: marketNewsRisk.shield,
    historicalQuality,
    dataQuality,
    errors,
    dataCompleteness,
    providerQuality,
  };
}
