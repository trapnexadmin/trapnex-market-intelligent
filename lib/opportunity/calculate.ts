import type { Opportunity, OpportunityInput } from "./types";

const clamp=(n:number)=>Math.max(0,Math.min(100,n));

export function calculateOpportunity(input:OpportunityInput,calculatedAt=new Date()):Opportunity{
  const returnComponent=input.expectedReturnPct===null?null:clamp(input.expectedReturnPct*5);
  const components=[
    input.stockScore,
    input.marketPulse,
    input.sectorPulse,
    input.riskShield,
    input.liquidityScore,
    returnComponent,
  ].filter((v):v is number=>v!==null&&Number.isFinite(v));

  const riskReward=
    input.expectedReturnPct!==null&&
    input.downsidePct!==null&&
    input.downsidePct>0
      ? input.expectedReturnPct/input.downsidePct
      : null;

  const score=components.length
    ? Math.round((components.reduce((a,b)=>a+b,0)/components.length)*10)/10
    : null;

  const reasons:string[]=[];
  if(input.expectedReturnPct!==null)
    reasons.push(input.expectedReturnPct>=10?"Expected return meets 10%+ threshold.":"Expected return below 10% threshold.");
  if(input.stockScore!==null) reasons.push(`Stock intelligence ${input.stockScore}/100.`);
  if(input.marketPulse!==null) reasons.push(`Market pulse ${input.marketPulse}/100.`);
  if(input.sectorPulse!==null) reasons.push(`Sector pulse ${input.sectorPulse}/100.`);
  if(input.riskShield!==null) reasons.push(`Risk shield ${input.riskShield}/100.`);

  let decision:Opportunity["decision"]="INSUFFICIENT_DATA";
  if(score!==null){
    if((input.expectedReturnPct??0)>=10 && score>=75 && (riskReward===null||riskReward>=1.5))
      decision="STRONG_CANDIDATE";
    else if((input.expectedReturnPct??0)>=10 && score>=60)
      decision="CANDIDATE";
    else if(score>=45)
      decision="WATCH";
    else
      decision="AVOID";
  }

  return {
    symbol:input.symbol,
    score,
    expectedReturnPct:input.expectedReturnPct,
    downsidePct:input.downsidePct,
    riskReward,
    decision,
    confidence:Math.round(((components.length+(input.stockConfidence>=50?1:0))/7)*100),
    reasons,
    calculatedAt:calculatedAt.toISOString(),
  };
}
