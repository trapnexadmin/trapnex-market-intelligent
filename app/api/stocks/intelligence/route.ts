import { NextRequest, NextResponse } from "next/server";
import { calculateStockIntelligenceScore } from "@/lib/stock-intelligence/calculate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json(
      { status: "INVALID_REQUEST", message: "symbol is required" },
      { status: 400 },
    );
  }

  // Phase 3A establishes the scoring contract.
  // Real fundamentals/technical/valuation/news/risk providers will populate
  // these fields in the following integration stages. No values are guessed.
  const result = calculateStockIntelligenceScore({
    symbol,
    fundamentalQuality: null,
    technicalStructure: null,
    valuation: null,
    institutionalFlow: null,
    sectorAlignment: null,
    newsEvent: null,
    riskTrapShield: null,
  });

  return NextResponse.json({
    status: result.status,
    intelligence: result,
    message:
      "Stock intelligence requires real factor inputs; no synthetic score is generated.",
  });
}
