import {
  runStockIntelligenceBatch,
} from "@/lib/stock-intelligence/batch";
import { calculateOpportunity } from "./calculate";
import { buildTechnicalPlan } from "./technical-plan";
import { deriveReturnModel } from "./return-model";
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

  const rankingUniverse = requested ??
    listUniverse()
      .filter((row) => row.exchange === "NSE")
      .map((row) => row.symbol);

  const pulseContext = await buildUnifiedMarketPulseContext();
  const contexts = new Map<string, SymbolContext>();

  await Promise.all(
    rankingUniverse.map(async (symbol) => {
      try {
        const context = await getUnifiedMarketContext(symbol, pulseContext);
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

      const context = contexts.get(row.symbol);

      const opportunity = calculateOpportunity({
        symbol: row.symbol,
        stockScore: row.score,
        stockConfidence: row.confidence,
        marketPulse: pulseContext.marketPulse,
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
    marketContext: pulseContext,
    ranked,
  };
}
