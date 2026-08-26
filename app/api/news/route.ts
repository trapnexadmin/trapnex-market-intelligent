import { NextRequest, NextResponse } from "next/server";
import { getCompanyNewsEvents } from "@/lib/news-intelligence/finnhub";

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

  try {
    const events = await getCompanyNewsEvents(symbol);
    return NextResponse.json({
      status: events.length ? "LIVE" : "INSUFFICIENT_DATA",
      symbol,
      events,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "UNAVAILABLE",
      symbol,
      events: [],
      message: error instanceof Error ? error.message : "News unavailable",
      checkedAt: new Date().toISOString(),
    }, { status: 503 });
  }
}
