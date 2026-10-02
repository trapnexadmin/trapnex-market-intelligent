import { NextResponse } from "next/server";
import { buildCompleteStockIntelligence } from "@/lib/stock-intelligence/integration/complete-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ symbol: string }> },
) {
  const { symbol } = await context.params;

  try {
    const result = await buildCompleteStockIntelligence(
      symbol.trim().toUpperCase(),
    );

    return NextResponse.json(
      {
        status: result.status,
        symbol: result.symbol,
        score: result.score,
        confidence: result.confidence,
        factors: result.factors,
        quote: result.quote,
        dataQuality: result.dataQuality,
        dataCompleteness: result.dataCompleteness,
        providerQuality: result.providerQuality,
        historicalQuality: result.historicalQuality,
        dangerScore: result.dangerScore,
        corporateActionRisk: result.corporateActionRisk,
        newsEvents: result.newsEvents,
        corporateActions: result.corporateActions,
        errors: result.errors,
        calculatedAt: result.calculatedAt,
      },
      { status: result.status === "READY" ? 200 : 503 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "PROVIDER_ERROR",
        symbol: symbol.toUpperCase(),
        error:
          error instanceof Error
            ? error.message
            : "STOCK_INTELLIGENCE_ERROR",
      },
      { status: 503 },
    );
  }
}
