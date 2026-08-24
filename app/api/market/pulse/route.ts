import { NextResponse } from "next/server";
import { calculateTrendPulse } from "@/lib/intelligence/pulse";
import { getMarketSnapshots } from "@/lib/providers/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getMarketSnapshots([]);

    if (!result.rows.length) {
      return NextResponse.json({
        status: "INSUFFICIENT_DATA",
        provider: result.provider,
        errors: result.errors,
        pulse: calculateTrendPulse({ snapshots: [] }),
        message: "No live market observations are available from the configured providers.",
        checkedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      status: "LIVE",
      provider: result.provider,
      fallbackUsed: result.fallbackUsed,
      pulse: calculateTrendPulse({ snapshots: result.rows }),
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "PROVIDER_ERROR",
      provider: null,
      pulse: calculateTrendPulse({ snapshots: [] }),
      message: error instanceof Error ? error.message : "Market pulse provider error",
      checkedAt: new Date().toISOString(),
    });
  }
}
