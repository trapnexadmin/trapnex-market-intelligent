import { NextRequest, NextResponse } from "next/server";
import { searchInstruments } from "@/lib/providers/angelone/instrument-master";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ status: "READY", results: [] });
  }

  try {
    const results = await searchInstruments(q, 20);

    return NextResponse.json({
      status: "LIVE",
      results: results.map((item) => ({
        symbol: item.symbol,
        name: item.name,
        exchange: item.exch_seg,
        token: item.token,
        instrumentType: item.instrumenttype,
      })),
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "UNAVAILABLE",
      results: [],
      message: error instanceof Error ? error.message : "Stock search unavailable",
      checkedAt: new Date().toISOString(),
    });
  }
}
