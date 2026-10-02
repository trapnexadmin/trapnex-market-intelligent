import { buildStockIntelligence } from "../engine";
import { calculateRiskTrapShield } from "../risk-trap-shield";
import {
  EMPTY_FUNDAMENTALS,
  EMPTY_INSTITUTIONAL_FLOW,
  EMPTY_VALUATION,
} from "./default-inputs";
import { loadValidatedQuote } from "./market-loader";
import { loadHistoricalCandles } from "./historical-loader";
import { resolveFundamentals } from "@/lib/providers/fundamentals/registry";
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

  const [live, history, fundamentalsResult] = await Promise.all([
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
  ]);

  const fundamentals =
    fundamentalsResult.fundamentals ?? EMPTY_FUNDAMENTALS;
  const valuation =
    fundamentalsResult.valuation ?? EMPTY_VALUATION;
  const institutionalFlow =
    fundamentalsResult.institutionalFlow ??
    EMPTY_INSTITUTIONAL_FLOW;

  const result = buildStockIntelligence({
    symbol,
    candles: history.candles,
    fundamentals,
    valuation,
    institutionalFlow,
    sectorAlignment: options.sectorPulse ?? null,
    newsEvent: null,
    riskTrapShield: calculateRiskTrapShield({
      dangerScore: null,
      leverageRisk: null,
      governanceRisk: null,
      liquidityRisk: null,
      abnormalPriceVolume: null,
    }),
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
  ];

  return {
    ...result,
    quote: live.quote,
    marketDataProvider: live.provider,
    historicalProvider: history.provider,
    fundamentalProvider: fundamentalsResult.provider,
    instrumentToken: history.instrumentToken,
    errors,
    dataCompleteness: {
      quote: live.quote !== null,
      historicalCandles: history.candles.length >= 50,
      fundamentals: fundamentalsResult.fundamentals !== null,
      valuation: fundamentalsResult.valuation !== null,
      institutionalFlow:
        fundamentalsResult.institutionalFlow !== null,
    },
  };
}
