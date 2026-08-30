import { NextRequest, NextResponse } from "next/server";
import { getCompanyNewsEvents } from "@/lib/news-intelligence/finnhub";
import { getMarketNews } from "@/lib/news-intelligence/market-sources";
import { scoreNewsEventWithAI, aggregateDanger } from "@/lib/news-intelligence/score";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase() || null;
  const scope = (request.nextUrl.searchParams.get("scope") || (symbol ? "STOCK" : "MARKET")).toUpperCase();

  try {
    const raw = symbol ? await getCompanyNewsEvents(symbol) : await getMarketNews();
    const events = await Promise.all(raw.map(scoreNewsEventWithAI));
    const danger = aggregateDanger(symbol, events);

    return NextResponse.json({
      status: danger.score === null ? "INSUFFICIENT_DATA" : "LIVE",
      scope,
      danger,
      events,
      sourceCount: new Set(events.map((event) => event.provider)).size,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "UNAVAILABLE",
      scope,
      danger: aggregateDanger(symbol, []),
      events: [],
      message: error instanceof Error ? error.message : "Danger radar unavailable",
      checkedAt: new Date().toISOString(),
    }, { status: 503 });
  }
}
