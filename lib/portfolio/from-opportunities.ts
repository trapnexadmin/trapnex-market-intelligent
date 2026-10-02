import type { PortfolioCandidate } from "./types";
export function candidatesFromRanking(ranked:Array<any>):PortfolioCandidate[] {
  return ranked.map(row=>{
    const o=row.opportunity, si=row.stockIntelligence, cls=row.classification;
    const eligible=(o?.decision==="CANDIDATE"||o?.decision==="STRONG_CANDIDATE")&&o?.score!==null;
    return {symbol:String(row.symbol).toUpperCase(),score:o?.score??null,confidence:o?.confidence??0,expectedReturnPct:o?.expectedReturnPct??null,riskShield:si?.riskTrapShield??null,liquidityScore:row.liquidity?.score??null,capBucket:cls?.capBucket??null,sector:cls?.sector??null,eligible,reasons:[...(o?.reasons??[]),...(eligible?[]:["NOT_OPPORTUNITY_ELIGIBLE"])]};
  });
}