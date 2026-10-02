import {
  runStockIntelligenceBatch,
} from "@/lib/stock-intelligence/batch";
import { calculateOpportunity } from "./calculate";
import { buildTechnicalPlan } from "./technical-plan";
import { deriveReturnModel } from "./return-model";
import { calculateLiquidityScore } from "./liquidity";
import {
  buildUnifiedMarketPulseContext,
  getUnifiedMarketContext,
} from "./unified-context";
import { listUniverse } from "@/lib/universe/registry";
import { ensureUniverseLoaded } from "@/lib/universe/bootstrap";

type CapBucket = "LARGE" | "MID" | "SMALL" | null;

interface SymbolContext {
  sectorPulse: number | null;
  capPulse: number | null;
  capBucket: CapBucket;
}

export async function runFullOpportunityRanking(symbols?: string[]) {
  await ensureUniverseLoaded();

  const requested = symbols?.length
    ? [...new Set(
        symbols
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean),
      )]
    : undefined;

  const rankingUniverse =
    requested ??
    listUniverse()
      .filter((row) => row.exchange === "NSE")
      .map((row) => row.symbol);

  const pulseContext = await buildUnifiedMarketPulseContext();
  const contexts = new Map<string, SymbolContext>();

  await Promise.all(
    rankingUniverse.map(async (symbol) => {
      try {
        const context = await getUnifiedMarketContext(
          symbol,
          pulseContext,
        );
        contexts.set(symbol, {
          sectorPulse: context.sectorPulse,
          capPulse: context.capPulse,
          capBucket: context.classification.capBucket,
        });
      } catch {
        contexts.set(symbol, {
          sectorPulse: null,
          capPulse: null,
          capBucket: null,
        });
      }
    }),
  );

  const batch = await runStockIntelligenceBatch({
    symbols: requested,
    marketPulse: pulseContext.marketPulse,
    capPulseResolver: async (symbol) =>
      contexts.get(symbol)?.capPulse ?? null,
    sectorPulseResolver: async (symbol) =>
      contexts.get(symbol)?.sectorPulse ?? null,
    persist: true,
  });

  const ranked = batch.results
    .filter(
      (row) =>
        row.status === "READY" &&
        row.score !== null,
    )
    .map((row) => {
      const plan = buildTechnicalPlan(row.candles ?? []);
      const returns = deriveReturnModel(
        plan.entry,
        plan.target,
        plan.stopLoss,
      );

      const liquidityScore = calculateLiquidityScore(
        row.candles ?? [],
        row.quote?.price ?? null,
      );

      const context = contexts.get(row.symbol);

      const opportunity = calculateOpportunity({
        symbol: row.symbol,
        stockScore: row.score,
        stockConfidence: row.confidence,
        marketPulse: pulseContext.marketPulse,
        sectorPulse: context?.sectorPulse ?? null,
        expectedReturnPct: returns.expectedReturnPct,
        downsidePct: returns.downsidePct,
        riskShield:
          row.corporateActionRisk === null
            ? null
            : Math.max(0, 100 - row.corporateActionRisk),
        liquidityScore,
      });

      return {
        symbol: row.symbol,
        stockIntelligence: row,
        opportunity,
        liquidity: {
          score: liquidityScore,
          source:
            row.candles?.some((candle) => candle.volume !== null)
              ? "historical_candle_turnover"
              : null,
          windowSessions: Math.min(20, row.candles?.length ?? 0),
          available:
            liquidityScore !== null,
          reason:
            liquidityScore !== null
              ? null
              : (row.candles?.length ?? 0) < 5
                ? "INSUFFICIENT_CANDLE_HISTORY"
                : "INSUFFICIENT_VOLUME_DATA",
        },
        dataIntegrity: {
          stockScoreAvailable: row.score !== null,
          quoteAvailable: row.quote !== null,
          historicalAvailable: (row.candles?.length ?? 0) >= 50,
          liquidityAvailable: liquidityScore !== null,
          marketPulseAvailable: pulseContext.marketPulse !== null,
          sectorPulseAvailable: context?.sectorPulse !== null,
          capPulseAvailable: context?.capPulse !== null,
        },
        classification: context
          ? {
              capBucket: context.capBucket,
              capPulse: context.capPulse,
              sectorPulse: context.sectorPulse,
            }
          : null,
      };
    })
    .sort(
      (a, b) =>
        (b.opportunity.score ?? -1) -
        (a.opportunity.score ?? -1),
    );

  return {
    ...batch,
    marketContext: pulseContext,
    rankingIntegrity: {
      liquidityProvider: "historical_candle_turnover",
      liquidityWindowSessions: 20,
      missingLiquidityDoesNotCreateSyntheticScore: true,
      rankedCount: ranked.length,
    },
    ranked,
  };
}
