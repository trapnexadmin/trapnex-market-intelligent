import { NextResponse } from "next/server";
import { loadHistoricalCandles } from "@/lib/stock-intelligence/integration/historical-loader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol")?.trim().toUpperCase();
  const days = Number(url.searchParams.get("days") ?? 120);
  if (!symbol) return NextResponse.json({ status: "REJECTED", error: "SYMBOL_REQUIRED" }, { status: 400 });

  try {
    const result = await loadHistoricalCandles(symbol, { days: Number.isFinite(days) ? days : 120 });
    return NextResponse.json({
      status: result.candles.length >= 50 ? "READY" : "INSUFFICIENT_DATA",
      symbol,
      provider: result.provider,
      instrumentToken: result.instrumentToken,
      count: result.candles.length,
      candles: result.candles,
      errors: result.errors,
    });
  } catch (error) {
    return NextResponse.json({
      status: "PROVIDER_ERROR",
      symbol,
      error: error instanceof Error ? error.message : "HISTORICAL_DATA_ERROR",
    }, { status: 503 });
  }
}
