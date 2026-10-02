import { NextResponse } from "next/server";
import { getFundamentalProviderHealth } from "@/lib/providers/fundamentals/registry";
import { getInstitutionalProviderHealth } from "@/lib/providers/institutional/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [fundamentals, institutional] = await Promise.all([
    getFundamentalProviderHealth(),
    getInstitutionalProviderHealth(),
  ]);

  return NextResponse.json({
    status:
      fundamentals.some((p) => p.status === "READY") ||
      institutional.some((p) => p.status === "READY")
        ? "READY"
        : "DEGRADED",
    fundamentals,
    institutional,
    checkedAt: new Date().toISOString(),
  });
}
