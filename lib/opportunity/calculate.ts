import type { Opportunity, OpportunityInput } from "./types";

const clamp=(n:number)=>Math.max(0,Math.min(100,n));
const THRESHOLD_RETURN=10;
const MIN_SCORE=60;
const STRONG_SCORE=75;
const MIN_RR=1.5;

export function calculateOpportunity(input:OpportunityInput,calculatedAt=new Date()):Opportunity{
  const returnComponent=input.expectedReturnPct===null?null:clamp(input.expectedReturnPct*5);
  const components=[
    input.stockScore,input.marketPulse,input.sectorPulse,input.riskShield,
    input.liquidityScore,returnComponent,
  ].filter((v):v is number=>v!==null&&Number.isFinite(v));

  const riskReward=
    input.expectedReturnPct!==null&&input.downsidePct!==null&&input.downsidePct>0
      ? input.expectedReturnPct/input.downsidePct:null;

  const score=components.length
    ? Math.round(clamp(components.reduce((a,b)=>a+b,0)/components.length)*10)/10:null;

  const reasons:string[]=[];
  if(input.expectedReturnPct!==null)
    reasons.push(input.expectedReturnPct>=THRESHOLD_RETURN
      ?"Expected return meets the 10% screening threshold."
      :"Expected return is below the 10% screening threshold.");
  if(input.stockScore!==null) reasons.push(`Stock intelligence: ${input.stockScore}/100.`);
  if(input.marketPulse!==null) reasons.push(`Market pulse: ${input.marketPulse}/100.`);
  if(input.sectorPulse!==null) reasons.push(`Sector pulse: ${input.sectorPulse}/100.`);
  if(input.riskShield!==null) reasons.push(`Risk shield: ${input.riskShield}/100.`);

  const confidence=Math.round(
    ((components.length+(input.stockConfidence>=50?1:0))/7)*100,
  );

  let decision:Opportunity["decision"]="INSUFFICIENT_DATA";
  if(score!==null && confidence>=60){
    if((input.expectedReturnPct??0)>=THRESHOLD_RETURN && score>=STRONG_SCORE &&
       (riskReward===null||riskReward>=MIN_RR)) decision="STRONG_CANDIDATE";
    else if((input.expectedReturnPct??0)>=THRESHOLD_RETURN && score>=MIN_SCORE)
      decision="CANDIDATE";
    else if(score>=45) decision="WATCH";
    else decision="AVOID";
  }

  return {
    symbol:input.symbol,score,expectedReturnPct:input.expectedReturnPct,
    downsidePct:input.downsidePct,riskReward,decision,confidence,reasons,
    calculatedAt:calculatedAt.toISOString(),
  };
}
