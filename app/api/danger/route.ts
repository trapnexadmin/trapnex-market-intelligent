import { NextRequest,NextResponse } from "next/server";
import { getCompanyNewsEvents } from "@/lib/news-intelligence/finnhub";
import { scoreNewsEventWithAI,calculateDangerSignal } from "@/lib/news-intelligence/score";
export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest){
  const symbol=request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  if(!symbol)return NextResponse.json({
    status:"INSUFFICIENT_DATA",
    danger:await calculateDangerSignal(null,[]),events:[],
    message:"Market-wide aggregation requires the market/global news pipeline."
  });
  try{
    const raw=await getCompanyNewsEvents(symbol);
    const events=await Promise.all(raw.map(scoreNewsEventWithAI));
    const danger=await calculateDangerSignal(symbol,events);
    return NextResponse.json({
      status:danger.score===null?"INSUFFICIENT_DATA":"LIVE",
      danger,events,checkedAt:new Date().toISOString()
    });
  }catch(error){
    return NextResponse.json({
      status:"UNAVAILABLE",danger:await calculateDangerSignal(symbol,[]),events:[],
      message:error instanceof Error?error.message:"Danger unavailable"
    },{status:503});
  }
}
