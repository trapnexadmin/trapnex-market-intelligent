import type { PortfolioAllocation, PortfolioAllocationPlan, PortfolioCandidate, PortfolioRiskProfile } from "./types";

const CAP_LIMITS: Record<PortfolioRiskProfile, Record<"LARGE"|"MID"|"SMALL", number>> = {
  CONSERVATIVE: { LARGE: 70, MID: 25, SMALL: 10 },
  BALANCED: { LARGE: 60, MID: 30, SMALL: 15 },
  GROWTH: { LARGE: 50, MID: 35, SMALL: 25 },
};
const MIN_PCT = 5, MAX_PCT = 20, MAX_STOCKS = 15;
const SECTOR_LIMIT_PCT = 30;
const clamp = (n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

function quality(c: PortfolioCandidate) {
  const values = [c.score,c.confidence,c.riskShield,c.liquidityScore]
    .filter((v):v is number=>v!==null&&Number.isFinite(v));
  if(c.expectedReturnPct!==null&&Number.isFinite(c.expectedReturnPct)) values.push(clamp(c.expectedReturnPct*5,0,100));
  return values.length ? values.reduce((a,b)=>a+b,0)/values.length : null;
}

export function buildPortfolioAllocationPlan(input:{capital:number;riskProfile?:PortfolioRiskProfile;candidates:PortfolioCandidate[]}):PortfolioAllocationPlan {
  const capital = Number.isFinite(input.capital)&&input.capital>0 ? input.capital : 0;
  const riskProfile = input.riskProfile && CAP_LIMITS[input.riskProfile] ? input.riskProfile : "BALANCED";
  const capLimits = CAP_LIMITS[riskProfile], warnings:string[]=[];
  const eligible = input.candidates.filter(c=>c.eligible&&quality(c)!==null).sort((a,b)=>(quality(b)??-1)-(quality(a)??-1)).slice(0,MAX_STOCKS);

  if(!eligible.length) return {
    capital,riskProfile,allocations:[],unallocatedAmount:capital,
    capExposurePct:{LARGE:0,MID:0,SMALL:0},sectorExposurePct:{},
    constraints:{minPerStockPct:MIN_PCT,maxPerStockPct:MAX_PCT,maxStocks:MAX_STOCKS,capLimitsPct:capLimits},
    warnings:["NO_ELIGIBLE_CANDIDATES"]
  };

  const total=eligible.reduce((s,c)=>s+(quality(c)??0),0);
  const capUsed={LARGE:0,MID:0,SMALL:0} as Record<"LARGE"|"MID"|"SMALL",number>;
  const sectorUsed:Record<string,number>={};
  const allocations:PortfolioAllocation[]=[];
  let remaining=100;

  for(const c of eligible){
    if(remaining<MIN_PCT) break;
    const raw=total>0?((quality(c)??0)/total)*100:MIN_PCT;
    const bucket=c.capBucket;
    const available=bucket===null?remaining:Math.max(0,capLimits[bucket]-capUsed[bucket]);
    const sector=(c.sector??"UNCLASSIFIED").toUpperCase();
    const sectorAvailable=Math.max(0,SECTOR_LIMIT_PCT-(sectorUsed[sector]??0));
    const weight=Math.min(clamp(raw,MIN_PCT,MAX_PCT),available,sectorAvailable,remaining);
    if(weight<MIN_PCT) continue;

    if(bucket) capUsed[bucket]+=weight;
    sectorUsed[sector]=(sectorUsed[sector]??0)+weight;
    allocations.push({
      symbol:c.symbol.toUpperCase(),capBucket:bucket,sector:c.sector,
      weightPct:Math.round(weight*100)/100,
      amount:Math.round((capital*weight/100)*100)/100,
      score:c.score,expectedReturnPct:c.expectedReturnPct,confidence:c.confidence,
      riskShield:c.riskShield,liquidityScore:c.liquidityScore,
      reasons:[...c.reasons,"Weight constrained by portfolio limits."]
    });
    remaining-=weight;
  }

  if(remaining>0) warnings.push("CAPACITY_REMAINING_AFTER_CONSTRAINTS");
  if(eligible.length>allocations.length) warnings.push("SOME_CANDIDATES_SKIPPED_BY_CONSTRAINTS");

  return {
    capital,riskProfile,allocations,
    unallocatedAmount:Math.round(capital*remaining)/100,
    capExposurePct:{
      LARGE:+capUsed.LARGE.toFixed(2),
      MID:+capUsed.MID.toFixed(2),
      SMALL:+capUsed.SMALL.toFixed(2)
    },
    sectorExposurePct:Object.fromEntries(Object.entries(sectorUsed).map(([k,v])=>[k,+v.toFixed(2)])),
    constraints:{
      minPerStockPct:MIN_PCT,maxPerStockPct:MAX_PCT,maxStocks:MAX_STOCKS,
      capLimitsPct:capLimits
    },
    warnings
  };
}