import { NextRequest, NextResponse } from "next/server";
import { getFundamentalValuationInputs } from "@/lib/stock-intelligence/integration/provider-factors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  if (!symbol) return NextResponse.json({ status: "INVALID_REQUEST", message: "symbol is required" }, { status: 400 });

  const data = await getFundamentalValuationInputs(symbol);
  return NextResponse.json({
    status: data.errors.length ? "DEGRADED" : "LIVE",
    symbol,
    profile: data.profile,
    fundamentals: data.fundamentals,
    valuation: data.valuation,
    errors: data.errors,
    checkedAt: new Date().toISOString(),
  });
}
