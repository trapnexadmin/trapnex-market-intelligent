import { NextRequest, NextResponse } from "next/server";
import { filterSymbols } from "@/lib/classification/pulse-input";
import { listClassifications } from "@/lib/classification/registry";
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get("sector") || "IT";
  const rows = filterSymbols(listClassifications(), { sector });
  return NextResponse.json({
    status: rows.length ? "READY" : "INSUFFICIENT_DATA",
    sector,
    count: rows.length,
    symbols: rows.map((x) => x.symbol),
  });
}
