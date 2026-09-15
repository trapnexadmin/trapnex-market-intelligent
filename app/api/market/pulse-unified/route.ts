import { NextResponse } from "next/server";
import { getMarketSnapshots } from "@/lib/providers/registry";
import { listClassifications } from "@/lib/classification/registry";
import { calculateUnifiedPulses } from "@/lib/market-pulse/unified";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const market = await getMarketSnapshots([]);
    const classifications = listClassifications();

    return NextResponse.json({
      status:
        market.rows.length > 0 && classifications.length > 0
          ? "LIVE"
          : "INSUFFICIENT_DATA",
      provider: market.provider,
      fallbackUsed: market.fallbackUsed,
      classificationCount: classifications.length,
      pulses: calculateUnifiedPulses(market.rows, classifications),
      errors: market.errors,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "PROVIDER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Unified pulse provider error",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
