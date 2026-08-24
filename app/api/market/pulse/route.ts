import { NextResponse } from "next/server";
import { calculateTrendPulse } from "@/lib/intelligence/pulse";
import { getMarketSnapshots } from "@/lib/providers/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Empty symbol list intentionally means the provider market universe.
    const result = await getMarketSnapshots([]);

    if (!result.rows.length) {
      // Data is unavailable, but this is not an application exception.
      // Return HTTP 200 so the dashboard does not continuously report a
      // failed API request while credentials/providers are unavailable.
      return NextResponse.json({
        status: "INSUFFICIENT_DATA",
        provider: result.provider,
        errors: result.errors,
        pulse: calculateTrendPulse({ snapshots: [] }),
        message: "Live market data is currently unavailable. No synthetic values are generated.",
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
      pulse: calculateTrendPulse({ snapshots: [] }),
      message: error instanceof Error ? error.message : "Market pulse provider error",
      checkedAt: new Date().toISOString(),
    });
  }
}
