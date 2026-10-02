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

  try {
    const market = await getUnifiedMarketContext();
    marketPulse = market.marketPulse;
  } catch {
    marketPulse = null;
  }

  const batch = await runStockIntelligenceBatch({
    symbols: requested,
    marketPulse,
    persist: true,
  });

  const ranked = batch.results
    .filter(
      (row) =>
        row.status === "READY" &&
        row.score !== null,
    )
    .map((row) => {
      const candles = row.quote
        ? [
            {
              high: row.quote.high ?? row.quote.price,
              low: row.quote.low ?? row.quote.price,
              close: row.quote.price,
            },
          ]
        : [];

      const plan = buildTechnicalPlan(candles);
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
        sectorPulse: null,
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
