import { NextResponse } from "next/server";
import { getMarketNewsContext } from "@/lib/news-intelligence/market-news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getMarketNewsContext();

  return NextResponse.json(result, {
    status: result.errors.length ? 503 : 200,
  });
}
