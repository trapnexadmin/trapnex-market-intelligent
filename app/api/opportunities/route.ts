import { NextRequest,NextResponse } from "next/server";
import { calculateOpportunity } from "@/lib/opportunity/calculate";
export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  const symbol=request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  if(!symbol)return NextResponse.json({
    status:"INSUFFICIENT_DATA",
    opportunities:[],
    message:"symbol is required",
    checkedAt:new Date().toISOString()
  });

  // Provider aggregation is intentionally isolated behind this context boundary.
  // Real market/sector/risk/level adapters replace nulls in the next integration.
  const opportunity=calculateOpportunity({
    symbol,
    stockScore:null,
    stockConfidence:0,
    marketPulse:null,
    sectorPulse:null,
    expectedReturnPct:null,
    downsidePct:null,
    riskShield:null,
    liquidityScore:null,
  });

  return NextResponse.json({
    status:opportunity.decision==="INSUFFICIENT_DATA"?"INSUFFICIENT_DATA":"READY",
    opportunity,
    checkedAt:new Date().toISOString(),
  });
}
