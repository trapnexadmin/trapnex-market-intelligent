import { NextResponse } from "next/server";
import { runFullOpportunityRanking } from "@/lib/opportunity/full-ranking";
import { candidatesFromRanking } from "@/lib/portfolio/from-opportunities";
import { buildPortfolioAllocationPlan } from "@/lib/portfolio/allocator";
import type { PortfolioRiskProfile } from "@/lib/portfolio/types";
export const runtime="nodejs"; export const dynamic="force-dynamic";
export async function GET(request:Request){
  const url=new URL(request.url);
  const capital=Number(url.searchParams.get("capital")??1000000);
  const rawRisk=(url.searchParams.get("riskProfile")??"BALANCED").toUpperCase();
  const risk=(["CONSERVATIVE","BALANCED","GROWTH"].includes(rawRisk)?rawRisk:"BALANCED") as PortfolioRiskProfile;
  const symbols=url.searchParams.get("symbols")?.split(",").map(s=>s.trim()).filter(Boolean);
  try{
    const ranking=await runFullOpportunityRanking(symbols);
    const plan=buildPortfolioAllocationPlan({capital,riskProfile:risk,candidates:candidatesFromRanking(ranking.ranked)});
    return NextResponse.json({status:plan.allocations.length?"READY":"INSUFFICIENT_DATA",sourceRunId:ranking.runId,plan,checkedAt:new Date().toISOString()});
  }catch(error){
    return NextResponse.json({status:"PROVIDER_ERROR",error:error instanceof Error?error.message:"PORTFOLIO_ALLOCATION_ERROR"},{status:503});
  }
}