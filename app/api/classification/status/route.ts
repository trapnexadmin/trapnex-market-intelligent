import { NextResponse } from "next/server";
import { listClassifications } from "@/lib/classification/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = listClassifications();
  return NextResponse.json({
    status: rows.length ? "READY" : "INSUFFICIENT_DATA",
    count: rows.length,
    effectiveDates: [...new Set(rows.map((row) => row.effectiveDate).filter(Boolean))],
    sources: [...new Set(rows.map((row) => row.source))],
    checkedAt: new Date().toISOString(),
  });
}
