import { NextResponse } from "next/server";
import { listHoldings } from "@/lib/portfolio/persistence";
import { runFullOpportunityRanking } from "@/lib/opportunity/full-ranking";
import { candidatesFromRanking } from "@/lib/portfolio/from-opportunities";
import { buildPortfolioAllocationPlan } from "@/lib/portfolio/allocator";
import type { PortfolioRiskProfile } from "@/lib/portfolio/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const portfolioKey = (url.searchParams.get("portfolioKey") ?? "default").trim() || "default";
  const capital = Number(url.searchParams.get("capital") ?? 1000000);
  const rawRisk = (url.searchParams.get("riskProfile") ?? "BALANCED").toUpperCase();
  const riskProfile = (["CONSERVATIVE", "BALANCED", "GROWTH"].includes(rawRisk)
    ? rawRisk
    : "BALANCED") as PortfolioRiskProfile;

  try {
    const [holdings, ranking] = await Promise.all([
      listHoldings(portfolioKey),
      runFullOpportunityRanking(),
    ]);

    const plan = buildPortfolioAllocationPlan({
      capital,
      riskProfile,
      candidates: candidatesFromRanking(ranking.ranked),
    });

    const bySymbol = new Map(plan.allocations.map((row) => [row.symbol, row]));
    const actualValue = holdings.reduce(
      (sum, holding) => sum + holding.quantity * holding.averagePrice,
      0,
    );

    const comparison = holdings.map((holding) => {
      const model = bySymbol.get(holding.symbol);
      const actualPct =
        actualValue > 0
          ? (holding.quantity * holding.averagePrice / actualValue) * 100
          : 0;
      const targetPct = model?.weightPct ?? 0;

      return {
        symbol: holding.symbol,
        exchange: holding.exchange,
        quantity: holding.quantity,
        averagePrice: holding.averagePrice,
        currentValue: holding.quantity * holding.averagePrice,
        actualWeightPct: Math.round(actualPct * 100) / 100,
        targetWeightPct: Math.round(targetPct * 100) / 100,
        driftPct: Math.round((actualPct - targetPct) * 100) / 100,
        modelIncluded: Boolean(model),
      };
    });

    const modelOnly = plan.allocations
      .filter(
        (row) =>
          !holdings.some(
            (holding) =>
              holding.symbol === row.symbol && holding.exchange === "NSE",
          ),
      )
      .map((row) => ({
        symbol: row.symbol,
        targetWeightPct: row.weightPct,
        targetAmount: row.amount,
        sector: row.sector,
        capBucket: row.capBucket,
      }));

    return NextResponse.json({
      status: "READY",
      portfolioKey,
      capital,
      riskProfile,
      holdings,
      actualValue,
      modelPlan: plan,
      comparison,
      modelOnly,
      sourceRunId: ranking.runId,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "PORTFOLIO_OVERVIEW_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "PORTFOLIO_OVERVIEW_ERROR",
      },
      { status: 503 },
    );
  }
}
