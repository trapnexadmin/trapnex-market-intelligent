import {NextRequest,NextResponse} from "next/server";
import {getMarketSnapshots} from "@/lib/providers/registry";
import {calculateSectorPulse} from "@/lib/market-pulse/sector-pulse";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  const sector=request.nextUrl.searchParams.get("sector")?.trim()||"NIFTY";
  try{
    const result=await getMarketSnapshots([]);
    const pulse=calculateSectorPulse(sector,result.rows);
    return NextResponse.json({
      status:pulse.score===null?"INSUFFICIENT_DATA":"LIVE",
      provider:result.provider,
      fallbackUsed:result.fallbackUsed,
      pulse,
      errors:result.errors,
      checkedAt:new Date().toISOString(),
    });
  }catch(error){
    return NextResponse.json({
      status:"PROVIDER_ERROR",
      pulse:calculateSectorPulse(sector,[]),
      message:error instanceof Error?error.message:"Sector pulse provider error",
      checkedAt:new Date().toISOString(),
    });
  }
}
