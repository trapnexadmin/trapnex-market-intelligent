import { NextResponse } from "next/server";
import { getProviderHealth } from "@/lib/providers/registry";
import { getFundamentalProviderHealth } from "@/lib/providers/fundamentals/registry";
import { getInstitutionalProviderHealth } from "@/lib/providers/institutional/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [market, fundamentals, institutional] = await Promise.all([
    getProviderHealth(),
    getFundamentalProviderHealth(),
    getInstitutionalProviderHealth(),
  ]);

  const providers = [
    ...market,
    ...fundamentals,
    ...institutional,
  ];

  const hasReady = providers.some((provider) => provider.status === "READY");
  const hasError = providers.some((provider) => provider.status === "ERROR");

  return NextResponse.json({
    status: hasError ? "DEGRADED" : hasReady ? "READY" : "NOT_CONFIGURED",
    checkedAt: new Date().toISOString(),
    providers,
  });
}
