import { NextRequest, NextResponse } from "next/server";
import { resolveQuotes } from "@/lib/providers/registry";

export async function GET(request: NextRequest) {
  const symbols = (request.nextUrl.searchParams.get("symbols") ?? "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  const result = await resolveQuotes(symbols);
  return NextResponse.json({
    status: result.quotes.length ? "LIVE" : "INSUFFICIENT_DATA",
    ...result,
    requestedSymbols: symbols,
    checkedAt: new Date().toISOString(),
  }, { status: result.quotes.length ? 200 : 503 });
}
