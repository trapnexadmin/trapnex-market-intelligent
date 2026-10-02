import { NextResponse } from "next/server";
import { listAllocationSnapshots } from "@/lib/portfolio/persistence";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:Request){
  const url=new URL(request.url);
  const portfolioKey=(url.searchParams.get("portfolioKey")??"default").trim()||"default";
  const limit=Math.max(1,Math.min(100,Number(url.searchParams.get("limit")??20)||20));

  try{
    const snapshots=await listAllocationSnapshots(portfolioKey,limit);
    return NextResponse.json({
      status:"READY",
      portfolioKey,
      snapshots,
      checkedAt:new Date().toISOString()
    });
  }catch(error){
    return NextResponse.json({
      status:"PERSISTENCE_ERROR",
      error:error instanceof Error?error.message:"PORTFOLIO_SNAPSHOTS_ERROR"
    },{status:503});
  }
}
