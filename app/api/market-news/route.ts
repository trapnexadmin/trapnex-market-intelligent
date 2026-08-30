import { NextRequest, NextResponse } from "next/server";
import { getGlobalNews, getMarketNews } from "@/lib/news-intelligence/market-sources";
import { scoreNewsEventWithAI } from "@/lib/news-intelligence/score";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request: NextRequest) {
  const scope=(request.nextUrl.searchParams.get("scope") || "INDIA").toUpperCase();

  try {
    const raw = scope === "GLOBAL" ? await getGlobalNews() : await getMarketNews();
    const events = await Promise.all(raw.map(scoreNewsEventWithAI));
    return NextResponse.json({
      status: events.length ? "LIVE" : "INSUFFICIENT_DATA",
      scope,
      events,
      scoringProvider: process.env.GOOGLE_AI_STUDIO_API_KEY ? "Google AI Studio" : "UNAVAILABLE",
      checkedAt:new Date().toISOString(),
    });
  } catch(error) {
    return NextResponse.json({
      status:"UNAVAILABLE",
      scope,
      events:[],
      message:error instanceof Error ? error.message : "Market news unavailable",
      checkedAt:new Date().toISOString(),
    },{status:503});
  }
}
