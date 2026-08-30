import { NextRequest,NextResponse } from "next/server";
import { calculateOpportunity } from "@/lib/opportunity/calculate";
import { rankOpportunities } from "@/lib/opportunity/ranking";
import { INDIA_LIQUID_UNIVERSE } from "@/lib/opportunity/universe";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  const requested=request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  const symbols=requested?[requested]:[...INDIA_LIQUID_UNIVERSE];

  const opportunities=symbols.map(symbol=>calculateOpportunity({
    symbol,
    stockScore:null,
    stockConfidence:0,
    marketPulse:null,
    sectorPulse:null,
    expectedReturnPct:null,
    downsidePct:null,
    riskShield:null,
    liquidityScore:null,
  }));

  const ranked=rankOpportunities(opportunities);

  return NextResponse.json({
    status:ranked.length?"READY":"INSUFFICIENT_DATA",
    universeSize:symbols.length,
    ranked,
    rejected:opportunities.filter(item=>item.decision==="INSUFFICIENT_DATA").map(item=>item.symbol),
    message:ranked.length
      ?"Candidates are ranked from verified inputs."
      :"Provider aggregation is not yet available; no candidate has been fabricated.",
    checkedAt:new Date().toISOString(),
  });
}
