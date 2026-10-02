import { NextResponse } from "next/server";
import { buildCompleteStockIntelligence } from "@/lib/stock-intelligence/integration/complete-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol")?.trim().toUpperCase();
  if (!symbol) return NextResponse.json({ status: "REJECTED", error: "SYMBOL_REQUIRED" }, { status: 400 });
  try {
    const result = await buildCompleteStockIntelligence(symbol);
    return NextResponse.json(result, { status: result.status === "READY" ? 200 : 503 });
  } catch (error) {
    return NextResponse.json({
      status: "PROVIDER_ERROR",
      symbol,
      error: error instanceof Error ? error.message : "STOCK_INTELLIGENCE_ERROR",
    }, { status: 503 });
  }
}
