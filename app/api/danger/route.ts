import { NextRequest, NextResponse } from "next/server";
import { getCompanyNewsEvents } from "@/lib/news-intelligence/finnhub";
import { getMarketNews } from "@/lib/news-intelligence/market-sources";
import { aggregateDanger, scoreNewsEventWithAI } from "@/lib/news-intelligence/score";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest) {
  const symbol=request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  const scope=(request.nextUrl.searchParams.get("scope") || (symbol ? "STOCK" : "MARKET")).toUpperCase();

  try {
    const raw = symbol ? await getCompanyNewsEvents(symbol) : await getMarketNews();
    const events = await Promise.all(raw.map(scoreNewsEventWithAI));
    const danger = aggregateDanger(symbol ?? null, events);
    return NextResponse.json({
      status: danger.score===null ? "INSUFFICIENT_DATA" : "LIVE",
      scope,
      danger,
      events,
      checkedAt:new Date().toISOString(),
    });
  } catch(error) {
    return NextResponse.json({
      status:"UNAVAILABLE",
      scope,
      danger:aggregateDanger(symbol ?? null,[]),
      events:[],
      message:error instanceof Error ? error.message : "Danger radar unavailable",
    },{status:503});
  }
}
