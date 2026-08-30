import type { MarketSnapshot } from "@/lib/intelligence/types";

export type CapBucket = "LARGE" | "MID" | "SMALL";

export interface CapPulse {
  bucket: CapBucket;
  score:number|null;
  direction:"BULLISH"|"NEUTRAL"|"BEARISH"|"INSUFFICIENT_DATA";
  sampleSize:number;
  calculatedAt:string;
}

const clamp=(n:number)=>Math.max(0,Math.min(100,n));

export function calculateCapPulse(bucket:CapBucket,snapshots:MarketSnapshot[]):CapPulse{
  const usable=snapshots.filter(s=>Number.isFinite(s.price)&&s.previousClose!==null&&Number.isFinite(s.previousClose));
  if(!usable.length){
    return {bucket,score:null,direction:"INSUFFICIENT_DATA",sampleSize:0,calculatedAt:new Date().toISOString()};
  }
  const avg=usable.reduce((sum,s)=>sum+((s.price-(s.previousClose as number))/(s.previousClose as number))*100,0)/usable.length;
  const score=clamp(50+avg*20);
  return {
    bucket,
    score:Math.round(score*10)/10,
    direction:score>=65?"BULLISH":score<=35?"BEARISH":"NEUTRAL",
    sampleSize:usable.length,
    calculatedAt:new Date().toISOString(),
  };
}
