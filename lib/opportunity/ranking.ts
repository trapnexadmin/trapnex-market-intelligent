import type { Opportunity } from "./types";

export function rankOpportunities(opportunities:Opportunity[]){
  return [...opportunities]
    .filter(item=>item.decision!=="INSUFFICIENT_DATA" && item.score!==null)
    .sort((a,b)=>{
      const score=(b.score??-1)-(a.score??-1);
      if(score!==0)return score;
      const ret=(b.expectedReturnPct??-Infinity)-(a.expectedReturnPct??-Infinity);
      if(ret!==0)return ret;
      return b.confidence-a.confidence;
    });
}
