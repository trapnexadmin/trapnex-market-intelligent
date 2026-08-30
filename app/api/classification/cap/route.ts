import { NextRequest, NextResponse } from "next/server";
import { filterSymbols } from "@/lib/classification/pulse-input";
import { listClassifications } from "@/lib/classification/registry";
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  const bucket = (
    request.nextUrl.searchParams.get("bucket") || "LARGE"
  ).toUpperCase() as "LARGE" | "MID" | "SMALL";
  const rows = filterSymbols(listClassifications(), { capBucket: bucket });
  return NextResponse.json({
    status: rows.length ? "READY" : "INSUFFICIENT_DATA",
    bucket,
    count: rows.length,
    symbols: rows.map((x) => x.symbol),
  });
}
