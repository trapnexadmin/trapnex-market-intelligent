import type { DangerSignal, NewsEvent, ScoredNewsEvent } from "./types";
import { classifyWithGoogleAI } from "./ai";

const clamp=(n:number)=>Math.max(0,Math.min(100,n));

export async function scoreNewsEventWithAI(event:NewsEvent):Promise<ScoredNewsEvent>{
  const ai=await classifyWithGoogleAI({headline:event.headline,summary:event.summary});
  if(ai){
    const newsScore=clamp((ai.sentiment+ai.materiality+(100-ai.marketImpact))/3);
    return {
      ...event,
      sentiment:ai.sentiment,
      materiality:ai.materiality,
      impact:ai.marketImpact,
      newsScore:Math.round(newsScore*10)/10,
      riskScore:Math.round(ai.risk*10)/10,
      reasons:[ai.category,ai.rationale],
    };
  }

  const sentiment=event.sentiment ?? 50;
  const materiality=event.materiality ?? 35;
  const impact=event.impact ?? ((100-sentiment)*0.65+materiality*0.35);
  return {
    ...event,
    sentiment,
    materiality,
    impact,
    newsScore:Math.round(clamp((sentiment+materiality+(100-impact))/3)*10)/10,
    riskScore:Math.round(clamp((impact+(100-sentiment))/2)*10)/10,
    reasons:["Fallback scoring used because Google AI Studio was unavailable."],
  };
}

export async function calculateDangerSignal(
  symbol:string|null,
  events:ScoredNewsEvent[],
):Promise<DangerSignal>{
  if(!events.length){
    return {
      symbol,scope:symbol?"STOCK":"MARKET",score:null,
      level:"INSUFFICIENT_DATA",reasons:[],sourceCount:0,
      calculatedAt:new Date().toISOString(),
    };
  }
  const highest=Math.max(...events.map(e=>e.riskScore ?? 0));
  return {
    symbol,scope:symbol?"STOCK":"MARKET",
    score:Math.round(highest*10)/10,
    level:highest>=75?"HIGH":highest>=45?"MEDIUM":"LOW",
    reasons:events.filter(e=>(e.riskScore??0)>=45).slice(0,5)
      .flatMap(e=>[e.headline,...e.reasons]),
    sourceCount:new Set(events.map(e=>e.provider)).size,
    calculatedAt:new Date().toISOString(),
  };
}
