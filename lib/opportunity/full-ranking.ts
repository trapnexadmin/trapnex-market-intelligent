import {
  runStockIntelligenceBatch,
} from "@/lib/stock-intelligence/batch";
import { calculateOpportunity } from "./calculate";
import { buildTechnicalPlan } from "./technical-plan";
import { deriveReturnModel } from "./return-model";
import { getUnifiedMarketContext } from "./unified-context";
import { listUniverse } from "@/lib/universe/registry";
import { ensureUniverseLoaded } from "@/lib/universe/bootstrap";

type CapBucket = "LARGE" | "MID" | "SMALL" | null;

interface SymbolContext {
  sectorPulse: number | null;
  capPulse: number | null;
  capBucket: CapBucket;
}

export async function runFullOpportunityRanking(
  symbols?: string[],
) {
  await ensureUniverseLoaded();

  const requested = symbols?.length
    ? [...new Set(
        symbols
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean),
      )]
    : undefined;

  const rankingUniverse = requested ??
    listUniverse()
      .filter((row) => row.exchange === "NSE")
      .map((row) => row.symbol);

  const contexts = new Map<string, SymbolContext>();
  let marketPulse: number | null = null;

  const contextResults = await Promise.all(
    rankingUniverse.map(async (symbol) => {
      try {
        return {
          symbol,
          context: await getUnifiedMarketContext(symbol),
        };
      } catch {
        return {
          symbol,
          context: null,
        };
      }
    }),
  );

  for (const item of contextResults) {
    const ctx = item.context;
    if (!ctx) continue;

    if (marketPulse === null && ctx.marketPulse !== null) {
      marketPulse = ctx.marketPulse;
    }

    contexts.set(item.symbol, {
      sectorPulse: ctx.sectorPulse,
      capPulse: null,
      capBucket: ctx.classification.capBucket,
    });
  }

  const batch = await runStockIntelligenceBatch({
    symbols: requested,
    marketPulse,
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

      const context = contexts.get(row.symbol);

      const opportunity = calculateOpportunity({
        symbol: row.symbol,
        stockScore: row.score,
        stockConfidence: row.confidence,
        marketPulse,
        sectorPulse: context?.sectorPulse ?? null,
        expectedReturnPct: returns.expectedReturnPct,
        downsidePct: returns.downsidePct,
        riskShield: row.corporateActionRisk === null
          ? null
          : Math.max(0, 100 - row.corporateActionRisk),
        liquidityScore: null,
      });

      return {
        symbol: row.symbol,
        stockIntelligence: row,
        opportunity,
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
    ranked,
  };
}
