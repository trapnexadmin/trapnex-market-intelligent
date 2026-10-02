import { NextResponse } from "next/server";
import { getStockIntelligenceReadiness } from "@/lib/providers/stock-intelligence-readiness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getStockIntelligenceReadiness();

  return NextResponse.json(result, {
    status:
      result.status === "READY"
        ? 200
        : result.status === "DEGRADED"
          ? 503
          : 424,
  });
}
