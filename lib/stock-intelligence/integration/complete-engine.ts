import { buildStockIntelligence } from "../engine";
import { calculateRiskTrapShield } from "../risk-trap-shield";
import { EMPTY_FUNDAMENTALS, EMPTY_INSTITUTIONAL_FLOW, EMPTY_VALUATION } from "./default-inputs";
import { loadValidatedQuote } from "./market-loader";
import { loadHistoricalCandles } from "./historical-loader";

export async function buildCompleteStockIntelligence(symbol: string) {
  const [live, history] = await Promise.all([
    loadValidatedQuote(symbol),
    loadHistoricalCandles(symbol, { interval: "ONE_DAY", days: 120 }),
  ]);

  const fundamentals = EMPTY_FUNDAMENTALS;
  const valuation = EMPTY_VALUATION;
  const institutionalFlow = EMPTY_INSTITUTIONAL_FLOW;

  const result = buildStockIntelligence({
    symbol,
    candles: history.candles.length ? history.candles : (live.candle ? [live.candle] : []),
    fundamentals,
    valuation,
    institutionalFlow,
    sectorAlignment: null,
    newsEvent: null,
    riskTrapShield: calculateRiskTrapShield({
      dangerScore: null,
      leverageRisk: null,
      governanceRisk: null,
      liquidityRisk: null,
      abnormalPriceVolume: null,
    }),
  });

  return {
    ...result,
    quote: live.quote,
    marketDataProvider: live.provider,
    historicalProvider: history.provider,
    instrumentToken: history.instrumentToken,
    errors: [...live.errors, ...history.errors],
    dataCompleteness: {
      quote: live.quote !== null,
      historicalCandles: history.candles.length >= 50,
      fundamentals: false,
      valuation: false,
      institutionalFlow: false,
    },
  };
}
