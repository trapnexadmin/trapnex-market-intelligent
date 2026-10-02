import { NextResponse } from "next/server";
import { buildLiveStockIntelligence } from "@/lib/stock-intelligence/integration/live-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol")?.trim().toUpperCase();
  if (!symbol) return NextResponse.json({ status: "REJECTED", error: "SYMBOL_REQUIRED" }, { status: 400 });
  try {
    const result = await buildLiveStockIntelligence(symbol);
    return NextResponse.json({
      status: result.status,
      symbol: result.symbol,
      score: result.score,
      confidence: result.confidence,
      factors: result.factors,
      quote: result.quote,
      provider: result.provider,
      fallbackUsed: result.fallbackUsed,
      errors: result.errors,
      calculatedAt: result.calculatedAt,
    }, { status: result.status === "INSUFFICIENT_DATA" ? 503 : 200 });
  } catch (error) {
    return NextResponse.json({ status: "PROVIDER_ERROR", symbol, error: error instanceof Error ? error.message : "STOCK_INTELLIGENCE_ERROR" }, { status: 503 });
  }
}
