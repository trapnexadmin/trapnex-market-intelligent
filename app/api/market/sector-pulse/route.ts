import { NextRequest, NextResponse } from "next/server";
import { resolveQuotes } from "@/lib/providers/registry";
import { calculateSectorPulse } from "@/lib/sector-pulse/calculate";
import type { SectorPulseInputRow } from "@/lib/sector-pulse/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get("sector")?.trim();

  const result = await resolveQuotes([]);

  if (!result.quotes.length) {
    return NextResponse.json({
      status: "INSUFFICIENT_DATA",
      provider: result.provider,
      sectors: [],
      message: "No normalized equity universe is available for sector-pulse calculation.",
      checkedAt: new Date().toISOString(),
    });
  }

  // Sector/company classification and sector membership are intentionally
  // data-driven. We do not infer sectors from ticker names.
  const rows: SectorPulseInputRow[] = [];

  if (sector) {
    return NextResponse.json({
      status: "INSUFFICIENT_DATA",
      provider: result.provider,
      sector,
      pulse: calculateSectorPulse(sector, rows),
      message:
        "Live quotes are available, but the current sector classification snapshot has not yet been loaded.",
      checkedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    status: "INSUFFICIENT_DATA",
    provider: result.provider,
    sectors: [],
    message:
      "Load the current instrument-to-sector classification before calculating Sector Pulse.",
    checkedAt: new Date().toISOString(),
  });
}
