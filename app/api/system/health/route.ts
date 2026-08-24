import { NextResponse } from "next/server";
import { getProviderHealth } from "@/lib/providers/registry";

export async function GET() {
  const providers = await getProviderHealth();
  const ready = providers.filter((p) => p.status === "READY").length;
  const configured = providers.filter((p) => p.status !== "NOT_CONFIGURED").length;
  return NextResponse.json({
    service: "trapnex-market-intelligence",
    status: ready === providers.length && ready > 0 ? "READY" : ready > 0 ? "DEGRADED" : configured ? "DEGRADED" : "WAITING_FOR_DATA",
    providers,
    checkedAt: new Date().toISOString(),
  });
}
