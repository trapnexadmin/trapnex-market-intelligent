import { NextRequest, NextResponse } from "next/server";
import {
  runFullOpportunityRanking,
} from "@/lib/opportunity/full-ranking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw =
    request.nextUrl.searchParams.get("symbols");

  const symbols = raw
    ? raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  try {
    const result =
      await runFullOpportunityRanking(symbols);

    return NextResponse.json({
      status: result.ranked.length
        ? "READY"
        : "INSUFFICIENT_DATA",
      runId: result.runId,
      universeSize: result.universeSize,
      readyCount: result.readyCount,
      insufficientCount:
        result.insufficientCount,
      errorCount: result.errorCount,
      ranked: result.ranked,
      checkedAt: result.completedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "PROVIDER_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "OPPORTUNITY_BATCH_ERROR",
      },
      { status: 503 },
    );
  }
}
