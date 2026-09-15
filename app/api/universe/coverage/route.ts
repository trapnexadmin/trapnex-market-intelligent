import { NextResponse } from "next/server";
import { ensureClassificationsLoaded } from "@/lib/classification/bootstrap";
import { calculateUniverseCoverage } from "@/lib/universe/coverage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const classifications = await ensureClassificationsLoaded();
  const coverage = calculateUniverseCoverage(classifications);

  return NextResponse.json({
    status: coverage.total ? "READY" : "INSUFFICIENT_DATA",
    coverage,
    checkedAt: new Date().toISOString(),
  });
}
