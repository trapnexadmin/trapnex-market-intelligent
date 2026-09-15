import { NextResponse } from "next/server";
import { diagnoseOpportunity } from "@/lib/opportunity/diagnostics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sample = diagnoseOpportunity(null, {
    marketPulse: null,
    sectorPulse: null,
    entry: null,
    target: null,
    stopLoss: null,
  });

  return NextResponse.json({
    status: "READY",
    contract: {
      decisionEligible: ["CANDIDATE", "STRONG_CANDIDATE"],
      requiredContext: ["MARKET_PULSE", "SECTOR_PULSE", "ENTRY", "TARGET", "STOP_LOSS"],
    },
    diagnosticsExample: sample,
    checkedAt: new Date().toISOString(),
  });
}
