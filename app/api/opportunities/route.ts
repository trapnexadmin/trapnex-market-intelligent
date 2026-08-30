import { NextRequest,NextResponse } from "next/server";
import { calculateOpportunity } from "@/lib/opportunity/calculate";
import { INDIA_LIQUID_UNIVERSE } from "@/lib/opportunity/universe";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  const symbol=request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  const symbols=symbol?[symbol]:[...INDIA_LIQUID_UNIVERSE];

  // Strict gate: provider aggregation is not yet allowed to invent missing
  // market/sector/risk/levels. This phase establishes the final aggregation boundary.
  const ranked=symbols.map(item=>calculateOpportunity({
    symbol:item,
    stockScore:null,
    stockConfidence:0,
    marketPulse:null,
    sectorPulse:null,
    expectedReturnPct:null,
    downsidePct:null,
    riskShield:null,
    liquidityScore:null,
  })).filter(item=>item.decision!=="INSUFFICIENT_DATA");

  return NextResponse.json({
    status:ranked.length?"READY":"INSUFFICIENT_DATA",
    universeSize:symbols.length,
    ranked,
    rejected:symbols.filter(item=>!ranked.some(candidate=>candidate.symbol===item)),
    message:ranked.length
      ?"Ranked from verified provider context."
      :"No verified provider context is currently available; no candidate was fabricated.",
    checkedAt:new Date().toISOString(),
  });
}
