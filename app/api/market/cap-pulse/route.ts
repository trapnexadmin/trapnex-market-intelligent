import {NextRequest,NextResponse} from "next/server";
import {getMarketSnapshots} from "@/lib/providers/registry";
import {calculateCapPulse} from "@/lib/market-pulse/cap-pulse";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  const bucket=(request.nextUrl.searchParams.get("bucket")||"LARGE").toUpperCase() as "LARGE"|"MID"|"SMALL";
  try{
    const result=await getMarketSnapshots([]);
    const pulse=calculateCapPulse(bucket,result.rows);
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
      pulse:calculateCapPulse(bucket,[]),
      message:error instanceof Error?error.message:"Cap pulse provider error",
      checkedAt:new Date().toISOString(),
    });
  }
}
