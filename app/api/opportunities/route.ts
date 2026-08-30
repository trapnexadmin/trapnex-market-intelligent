import {NextRequest,NextResponse} from "next/server";
import {aggregateProviderContext} from "@/lib/opportunity/aggregate";
import {INDIA_LIQUID_UNIVERSE} from "@/lib/opportunity/universe";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  const requested=request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  const symbols=requested?[requested]:[...INDIA_LIQUID_UNIVERSE];

  // This endpoint is now provider-ready. Until real provider adapters are
  // configured, null values remain explicit and candidates are not fabricated.
  const ranked=symbols.map(symbol=>aggregateProviderContext(symbol,{
    quote:null,
    stockScore:null,
    stockConfidence:0,
    marketPulse:null,
    sectorPulse:null,
    riskShield:null,
    liquidityScore:null,
    entry:null,
    target:null,
    stopLoss:null,
    sources:[],
    errors:["REAL_PROVIDER_ADAPTERS_PENDING"],
  },[])).filter(item=>item.decision!=="INSUFFICIENT_DATA");

  return NextResponse.json({
    status:ranked.length?"READY":"INSUFFICIENT_DATA",
    universeSize:symbols.length,
    ranked,
    rejected:symbols.filter(symbol=>!ranked.some(item=>item.symbol===symbol)),
    checkedAt:new Date().toISOString(),
  });
}
