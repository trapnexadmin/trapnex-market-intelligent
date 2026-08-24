import { NextRequest, NextResponse } from "next/server";
import { loadInstrumentMaster, searchInstruments } from "@/lib/providers/angelone/instrument-master";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");
    const refresh = request.nextUrl.searchParams.get("refresh") === "true";

    if (refresh) {
      await loadInstrumentMaster(true);
    }

    const results = query ? await searchInstruments(query) : [];
    return NextResponse.json({
      status: "READY",
      count: results.length,
      instruments: results,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "ERROR",
      message: error instanceof Error ? error.message : "Instrument master failed",
    }, { status: 503 });
  }
}
