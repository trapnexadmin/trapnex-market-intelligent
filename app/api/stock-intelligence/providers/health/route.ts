import { NextResponse } from "next/server";
import { getFundamentalProviderHealth } from "@/lib/providers/fundamentals/registry";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET() {
  const providers = await getFundamentalProviderHealth();
  return NextResponse.json({
    status: providers.some(p=>p.status==="READY") ? "READY" : "DEGRADED",
    providers,
    checkedAt: new Date().toISOString(),
  });
}
