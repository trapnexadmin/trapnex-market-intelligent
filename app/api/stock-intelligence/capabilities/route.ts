import { NextResponse } from "next/server";
import { getMarketCapabilityReport } from "@/lib/providers/market-capability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getMarketCapabilityReport());
}
