import { NextResponse } from "next/server";
import { getCompanyNewsEvents } from "@/lib/news-intelligence/finnhub";
import { scoreNewsEventWithAI, aggregateDanger } from "@/lib/news-intelligence/score";
import { getCompanyCorporateActions } from "@/lib/news-intelligence/corporate-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol")?.trim().toUpperCase();

  if (!symbol) {
    return NextResponse.json(
      { status: "REJECTED", error: "SYMBOL_REQUIRED" },
      { status: 400 },
    );
  }

  try {
    const [news, actions] = await Promise.all([
      getCompanyNewsEvents(symbol).catch(() => []),
      getCompanyCorporateActions(symbol).catch(() => []),
    ]);

    const events = await Promise.all(news.map(scoreNewsEventWithAI));

    return NextResponse.json(
      {
        status: events.length || actions.length ? "READY" : "INSUFFICIENT_DATA",
        symbol,
        events,
        danger: aggregateDanger(symbol, events),
        corporateActions: actions,
        checkedAt: new Date().toISOString(),
      },
      { status: events.length || actions.length ? 200 : 503 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "PROVIDER_ERROR",
        symbol,
        error: error instanceof Error ? error.message : "EVENT_DATA_ERROR",
      },
      { status: 503 },
    );
  }
}
