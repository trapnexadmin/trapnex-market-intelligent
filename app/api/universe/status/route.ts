import { NextResponse } from "next/server";
import { listUniverse, universeSize } from "@/lib/universe/registry";
import { ensureUniverseLoaded } from "@/lib/universe/bootstrap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  await ensureUniverseLoaded();
  const rows = listUniverse({ activeOnly: false });
  const active = rows.filter((row) => row.active && row.listed);

  return NextResponse.json({
    status: rows.length ? "READY" : "INSUFFICIENT_DATA",
    total: universeSize(),
    active: active.length,
    inactive: rows.length - active.length,
    exchanges: {
      NSE: active.filter((row) => row.exchange === "NSE").length,
      BSE: active.filter((row) => row.exchange === "BSE").length,
    },
    capBuckets: {
      LARGE: active.filter((row) => row.capBucket === "LARGE").length,
      MID: active.filter((row) => row.capBucket === "MID").length,
      SMALL: active.filter((row) => row.capBucket === "SMALL").length,
      UNCLASSIFIED: active.filter((row) => row.capBucket === null).length,
    },
    sectors: new Set(
      active.map((row) => row.sector).filter(Boolean),
    ).size,
    checkedAt: new Date().toISOString(),
  });
}
