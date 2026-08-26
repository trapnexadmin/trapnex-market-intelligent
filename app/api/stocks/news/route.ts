import { NextRequest, NextResponse } from "next/server";
import { finnhubRequest } from "@/lib/providers/finnhub/client";

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

  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 7);

  try {
    const news = await finnhubRequest<any[]>("/company-news", {
      symbol,
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    });

    return NextResponse.json({
      status: Array.isArray(news) && news.length ? "LIVE" : "INSUFFICIENT_DATA",
      symbol,
      provider: "Finnhub",
      news: Array.isArray(news) ? news.slice(0, 30) : [],
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "UNAVAILABLE",
      symbol,
      provider: "Finnhub",
      news: [],
      message: error instanceof Error ? error.message : "News unavailable",
      checkedAt: new Date().toISOString(),
    }, { status: 503 });
  }
}
