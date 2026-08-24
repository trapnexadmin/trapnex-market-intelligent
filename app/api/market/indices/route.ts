import { NextRequest, NextResponse } from "next/server";
import { resolveIndices } from "@/lib/providers/registry";

export async function GET(request: NextRequest) {
  const symbols = (request.nextUrl.searchParams.get("symbols") ?? "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  const result = await resolveIndices(symbols);
  return NextResponse.json({
    status: result.indices.length ? "LIVE" : "INSUFFICIENT_DATA",
    ...result,
    requestedSymbols: symbols,
    checkedAt: new Date().toISOString(),
  }, { status: result.indices.length ? 200 : 503 });
}
