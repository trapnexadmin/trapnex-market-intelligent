import {
  runStockIntelligenceBatch,
} from "@/lib/stock-intelligence/batch";
import { calculateOpportunity } from "./calculate";
import { buildTechnicalPlan } from "./technical-plan";
import { deriveReturnModel } from "./return-model";
import { getUnifiedMarketContext } from "./unified-context";

export async function runFullOpportunityRanking(
  symbols?: string[],
) {
  const requested = symbols?.length
    ? [...new Set(
        symbols
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean),
      )]
    : undefined;

  let marketPulse: number | null = null;
  let unifiedMarketForSymbol: (
    symbol: string,
  ) => Promise<{ marketPulse: number | null; sectorPulse: number | null; classification: { capBucket: "LARGE" | "MID" | "SMALL" | null } }> =
    async () => ({ marketPulse: null, sectorPulse: null, classification: { capBucket: null } });

  try {
    const market = await getUnifiedMarketContext("RELIANCE");
    marketPulse = market.marketPulse;
    unifiedMarketForSymbol = async (symbol) => {
      try {
        return await getUnifiedMarketContext(symbol);
      } catch {
        return {
          marketPulse,
          sectorPulse: null,
          classification: { capBucket: null },
        };
      }
    };
  } catch {
    marketPulse = null;
  }

  const symbolsToRank = requested;
  const contexts = new Map<string, { sectorPulse: number | null; capBucket: "LARGE" | "MID" | "SMALL" | null }>();
  if (symbolsToRank) {
    await Promise.all(symbolsToRank.map(async (symbol) => {
      const ctx = await unifiedMarketForSymbol(symbol);
      contexts.set(symbol, {
        sectorPulse: ctx.sectorPulse,
        capBucket: ctx.classification.capBucket,
      });
    }));
  }

  const batch = await runStockIntelligenceBatch({
    symbols: requested,
    marketPulse,
    capPulseResolver: async (symbol) => {
      const ctx = contexts.get(symbol);
      if (!ctx || !ctx.capBucket) return null;
      return null;
    },
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

      const opportunity = calculateOpportunity({
        symbol: row.symbol,
        stockScore: row.score,
        stockConfidence: row.confidence,
        marketPulse,
        sectorPulse: contexts.get(row.symbol)?.sectorPulse ?? null,
        expectedReturnPct:
          returns.expectedReturnPct,
        downsidePct: returns.downsidePct,
        riskShield: null,
        liquidityScore: null,
      });

      return {
        symbol: row.symbol,
        stockIntelligence: row,
        opportunity,
        classification: contexts.get(row.symbol) ?? null,
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
