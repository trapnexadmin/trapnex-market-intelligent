import { NextResponse } from "next/server";
import { getHistoricalProviderHealth } from "@/lib/providers/historical-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const providers = await getHistoricalProviderHealth();

  return NextResponse.json({
    status: providers.some((p) => p.status === "READY")
      ? "READY"
      : "NOT_CONFIGURED",
    checkedAt: new Date().toISOString(),
    providers,
  });
}
