import { NextRequest, NextResponse } from "next/server";
import { resolveQuotes } from "@/lib/providers/registry";
import { calculateBreadthFromQuotes } from "@/lib/breadth/build-from-market-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const market = (
    request.nextUrl.searchParams.get("market") || "NIFTY500"
  ).toUpperCase();

  const result = await resolveQuotes([]);

  if (!result.quotes.length) {
    return NextResponse.json({
      status: "INSUFFICIENT_DATA",
      market,
      provider: result.provider,
      errors: result.errors,
      breadth: null,
      message:
        "No normalized market universe is currently available for breadth calculation.",
      checkedAt: new Date().toISOString(),
    });
  }

  const breadth = calculateBreadthFromQuotes(market, result.quotes);

  return NextResponse.json({
    status: breadth.status,
    market,
    provider: result.provider,
    fallbackUsed: result.fallbackUsed,
    breadth,
    checkedAt: new Date().toISOString(),
  });
}
