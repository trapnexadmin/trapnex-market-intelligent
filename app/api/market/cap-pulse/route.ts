import { NextRequest, NextResponse } from "next/server";
import { resolveQuotes } from "@/lib/providers/registry";
import { calculateCapPulse } from "@/lib/cap-pulse/calculate";
import type { CapPulseInputRow, CapSegment } from "@/lib/cap-pulse/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const segments: CapSegment[] = ["LARGE", "MID", "SMALL"];

export async function GET(request: NextRequest) {
  const market = (
    request.nextUrl.searchParams.get("market") || "NIFTY500"
  ).toUpperCase();

  const result = await resolveQuotes([]);

  if (!result.quotes.length) {
    return NextResponse.json({
      status: "INSUFFICIENT_DATA",
      market,
      provider: result.provider,
      pulses: segments.map((segment) => calculateCapPulse(segment, [])),
      errors: result.errors,
      message:
        "No normalized equity universe is available for market-cap pulse calculation.",
      checkedAt: new Date().toISOString(),
    });
  }

  // Quotes are real, but the current approved AMFI/SEBI classification
  // snapshot is not yet persisted. We intentionally do not guess segments.
  const rows: CapPulseInputRow[] = [];

  return NextResponse.json({
    status: "INSUFFICIENT_DATA",
    market,
    provider: result.provider,
    pulses: segments.map((segment) => calculateCapPulse(segment, rows)),
    message:
      "Live quotes are available; load the current AMFI/SEBI market-cap classification before calculating Large/Mid/Small Pulse.",
    checkedAt: new Date().toISOString(),
  });
}
