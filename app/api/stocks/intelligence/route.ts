import { NextRequest, NextResponse } from "next/server";
import { calculateRiskTrapShield } from "@/lib/stock-intelligence/risk-trap-shield";

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

  const riskTrapShield = calculateRiskTrapShield({
    dangerScore: null,
    leverageRisk: null,
    governanceRisk: null,
    liquidityRisk: null,
    abnormalPriceVolume: null,
  });

  return NextResponse.json({
    status: "INSUFFICIENT_DATA",
    symbol,
    riskTrapShield,
    message:
      "Risk/Trap Shield is ready for real danger, leverage, governance, liquidity and abnormal-volume inputs.",
    checkedAt: new Date().toISOString(),
  });
}
