import { NextRequest, NextResponse } from "next/server";
import { resolveIndices } from "@/lib/providers/registry";
import { reconcileIndices } from "@/lib/market/reconciliation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const symbols = (request.nextUrl.searchParams.get("symbols") ?? "")
    .split(",").map(s => s.trim()).filter(Boolean);
  const result = await resolveIndices(symbols);
  const indices = reconcileIndices(result.indices);

  return NextResponse.json({
    status: indices.length ? "LIVE" : "INSUFFICIENT_DATA",
    indices,
    provider: result.provider,
    fallbackUsed: result.fallbackUsed,
    checkedAt: new Date().toISOString(),
  }, { status: indices.length ? 200 : 503 });
}
