import { NextRequest, NextResponse } from "next/server";
import { getCompanyNewsEvents } from "@/lib/news-intelligence/finnhub";
import { calculateDangerSignal, scoreNewsEvent } from "@/lib/news-intelligence/score";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json({
      status: "INSUFFICIENT_DATA",
      danger: calculateDangerSignal(null, []),
      events: [],
      message: "Market-wide danger aggregation requires multi-source market news.",
      checkedAt: new Date().toISOString(),
    });
  }

  try {
    const events = await getCompanyNewsEvents(symbol);
    const danger = calculateDangerSignal(symbol, events);

    return NextResponse.json({
      status: danger.score === null ? "INSUFFICIENT_DATA" : "LIVE",
      danger,
      events: events.map(scoreNewsEvent),
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "UNAVAILABLE",
        danger: calculateDangerSignal(symbol, []),
        events: [],
        message: error instanceof Error ? error.message : "Danger unavailable",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
