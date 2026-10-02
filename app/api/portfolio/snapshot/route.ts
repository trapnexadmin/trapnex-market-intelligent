import { NextResponse } from "next/server";
import { saveAllocationSnapshot } from "@/lib/portfolio/persistence";
import type { PortfolioAllocationPlan } from "@/lib/portfolio/types";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function POST(request:Request){
  try{
    const body=await request.json();
    const portfolioKey=(String(body.portfolioKey??"default").trim()||"default");
    const plan=body.plan as PortfolioAllocationPlan|undefined;
    if(!plan || !Number.isFinite(Number(plan.capital)) || !Array.isArray(plan.allocations))
      return NextResponse.json({status:"REJECTED",error:"INVALID_ALLOCATION_PLAN"},{status:400});

    await saveAllocationSnapshot(portfolioKey,plan);
    return NextResponse.json({status:"READY",portfolioKey,saved:true});
  }catch(error){
    return NextResponse.json({status:"PERSISTENCE_ERROR",error:error instanceof Error?error.message:"PORTFOLIO_SNAPSHOT_ERROR"},{status:503});
  }
}
