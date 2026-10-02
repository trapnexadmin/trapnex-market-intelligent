import type { PortfolioAllocationPlan } from "./types";

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

async function request(path:string, init:RequestInit={}) {
  const c=config();
  if(!c) return null;
  const response=await fetch(`${c.url}/rest/v1/${path}`,{
    ...init,
    headers:{
      apikey:c.key,
      Authorization:`Bearer ${c.key}`,
      "Content-Type":"application/json",
      Prefer:"return=representation",
      ...(init.headers??{})
    },
    cache:"no-store"
  });
  if(!response.ok) throw new Error(`SUPABASE_PORTFOLIO_${response.status}`);
  return response;
}

export interface PortfolioHolding {
  id?: string;
  portfolioKey:string;
  symbol:string;
  exchange:"NSE"|"BSE";
  quantity:number;
  averagePrice:number;
  notes:string|null;
  updatedAt?:string;
}

export async function listHoldings(portfolioKey:string):Promise<PortfolioHolding[]> {
  const key=encodeURIComponent(portfolioKey);
  const response=await request(`portfolio_holdings?select=id,portfolio_key,symbol,exchange,quantity,average_price,notes,updated_at&portfolio_key=eq.${key}&order=symbol.asc`);
  if(!response) return [];
  const rows=await response.json();
  return rows.map((row:any)=>({
    id:row.id,
    portfolioKey:String(row.portfolio_key),
    symbol:String(row.symbol).toUpperCase(),
    exchange:String(row.exchange).toUpperCase()==="BSE"?"BSE":"NSE",
    quantity:Number(row.quantity),
    averagePrice:Number(row.average_price),
    notes:row.notes??null,
    updatedAt:row.updated_at
  }));
}

export async function upsertHolding(input:PortfolioHolding) {
  const response=await request("portfolio_holdings",{
    method:"POST",
    headers:{Prefer:"resolution=merge-duplicates,return=representation"},
    body:JSON.stringify([{
      portfolio_key:input.portfolioKey,
      symbol:input.symbol.toUpperCase(),
      exchange:input.exchange,
      quantity:input.quantity,
      average_price:input.averagePrice,
      notes:input.notes??null
    }])
  });
  return response ? response.json() : null;
}

export async function deleteHolding(portfolioKey:string,symbol:string,exchange:"NSE"|"BSE"="NSE") {
  const key=encodeURIComponent(portfolioKey);
  const sym=encodeURIComponent(symbol.toUpperCase());
  const ex=encodeURIComponent(exchange);
  await request(`portfolio_holdings?portfolio_key=eq.${key}&symbol=eq.${sym}&exchange=eq.${ex}`,{method:"DELETE"});
  return true;
}

export async function saveAllocationSnapshot(portfolioKey:string,plan:PortfolioAllocationPlan) {
  await request("portfolio_snapshots",{
    method:"POST",
    body:JSON.stringify([{
      portfolio_key:portfolioKey,
      capital:plan.capital,
      risk_profile:plan.riskProfile,
      allocation_plan:plan
    }])
  });
  return true;
}


export interface PortfolioSnapshot {
  id?: string;
  portfolioKey:string;
  capital:number;
  riskProfile:string;
  allocationPlan:PortfolioAllocationPlan;
  observedAt?:string;
}

function mapSnapshot(row:any):PortfolioSnapshot {
  return {
    id:row.id,
    portfolioKey:String(row.portfolio_key),
    capital:Number(row.capital),
    riskProfile:String(row.risk_profile),
    allocationPlan:row.allocation_plan as PortfolioAllocationPlan,
    observedAt:row.observed_at
  };
}

export async function listAllocationSnapshots(
  portfolioKey:string,
  limit=20,
):Promise<PortfolioSnapshot[]> {
  const key=encodeURIComponent(portfolioKey);
  const safeLimit=Math.max(1,Math.min(100,Math.floor(Number(limit)||20)));
  const response=await request(
    `portfolio_snapshots?select=id,portfolio_key,capital,risk_profile,allocation_plan,observed_at&portfolio_key=eq.${key}&order=observed_at.desc&limit=${safeLimit}`,
  );
  if(!response) return [];
  const rows=await response.json();
  return rows.map(mapSnapshot);
}
