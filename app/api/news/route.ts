import { NextRequest,NextResponse } from "next/server";
import { getCompanyNewsEvents } from "@/lib/news-intelligence/finnhub";
import { scoreNewsEventWithAI } from "@/lib/news-intelligence/score";
export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  const symbol=request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  if(!symbol)return NextResponse.json({status:"INVALID_REQUEST",message:"symbol is required"},{status:400});
  try{
    const events=await getCompanyNewsEvents(symbol);
    const scored=await Promise.all(events.map(scoreNewsEventWithAI));
    return NextResponse.json({
      status:scored.length?"LIVE":"INSUFFICIENT_DATA",
      symbol,events:scored,
      scoringProvider:process.env.GOOGLE_AI_STUDIO_API_KEY?"Google AI Studio":"Deterministic fallback",
      checkedAt:new Date().toISOString()
    });
  }catch(error){
    return NextResponse.json({
      status:"UNAVAILABLE",symbol,events:[],
      message:error instanceof Error?error.message:"News unavailable",
      checkedAt:new Date().toISOString()
    },{status:503});
  }
}
