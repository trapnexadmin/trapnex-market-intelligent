import { NextRequest, NextResponse } from "next/server";
import { resolveBreadth } from "@/lib/providers/registry";

export async function GET(request: NextRequest) {
  const market = (request.nextUrl.searchParams.get("market") ?? "NIFTY500").toUpperCase();
  const result = await resolveBreadth(market);
  return NextResponse.json({
    status: result.breadth ? "LIVE" : "INSUFFICIENT_DATA",
    ...result,
    market,
    checkedAt: new Date().toISOString(),
  }, { status: result.breadth ? 200 : 503 });
}
