import { NextResponse } from "next/server";
import { getMarketSnapshots } from "@/lib/providers/registry";
import { calculateNiftyPulse } from "@/lib/intelligence/nifty-pulse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getMarketSnapshots([]);

    if (!result.rows.length) {
      return NextResponse.json({
        status: "INSUFFICIENT_DATA",
        index: "NIFTY 50",
        provider: result.provider,
        pulse: calculateNiftyPulse({ snapshots: [] }),
        errors: result.errors,
        checkedAt: new Date().toISOString(),
      });
    }

    const pulse = calculateNiftyPulse({
      snapshots: result.rows,
    });

    return NextResponse.json({
      status: pulse.direction === "INSUFFICIENT_DATA" ? "INSUFFICIENT_DATA" : "LIVE",
      index: "NIFTY 50",
      provider: result.provider,
      fallbackUsed: result.fallbackUsed,
      pulse,
      errors: result.errors,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "PROVIDER_ERROR",
      index: "NIFTY 50",
      pulse: calculateNiftyPulse({ snapshots: [] }),
      message: error instanceof Error ? error.message : "NIFTY Trend Pulse error",
      checkedAt: new Date().toISOString(),
    });
  }
}
