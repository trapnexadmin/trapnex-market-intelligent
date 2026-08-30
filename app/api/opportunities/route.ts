import { NextRequest, NextResponse } from "next/server";
import { calculateOpportunity } from "@/lib/opportunity/calculate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json({
      status: "INSUFFICIENT_DATA",
      opportunities: [],
      message:
        "Opportunity ranking requires verified stock, market, sector, return and risk inputs.",
      checkedAt: new Date().toISOString(),
    });
  }

  const opportunity = calculateOpportunity({
    symbol,
    stockScore: null,
    stockConfidence: 0,
    marketPulse: null,
    sectorPulse: null,
    expectedReturnPct: null,
    downsidePct: null,
    riskShield: null,
    liquidityScore: null,
  });

  return NextResponse.json({
    status:
      opportunity.decision === "INSUFFICIENT_DATA"
        ? "INSUFFICIENT_DATA"
        : "READY",
    opportunity,
    checkedAt: new Date().toISOString(),
  });
}
