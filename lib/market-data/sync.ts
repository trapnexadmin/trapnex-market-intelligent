import { randomUUID } from "crypto";
import { listUniverse } from "@/lib/universe/registry";
import { ensureUniverseLoaded } from "@/lib/universe/bootstrap";
import { resolveQuotes } from "@/lib/providers/registry";
import { persistMarketQuotes, persistMarketRun } from "./supabase";
import { validateQuotes } from "./quality";
import type { MarketSyncResult } from "./types";
const CHUNK_SIZE=100;
function chunks<T>(items:T[],size:number){const out:T[][]=[];for(let i=0;i<items.length;i+=size)out.push(items.slice(i,i+size));return out;}
export async function syncUniverseQuotes():Promise<MarketSyncResult>{
 const startedAt=new Date().toISOString();const runId=randomUUID();await ensureUniverseLoaded();const universe=listUniverse({activeOnly:true});const symbols=universe.map(r=>r.providerSymbol).filter(Boolean);
 if(!symbols.length)return {status:"INSUFFICIENT_DATA",runId,provider:null,requested:0,received:0,accepted:0,rejected:0,missing:[],errors:["ACTIVE_UNIVERSE_EMPTY"],startedAt,finishedAt:new Date().toISOString()};
 const allQuotes:any[]=[];const errors:string[]=[];let provider:string|null=null;
 for(const batch of chunks(symbols,CHUNK_SIZE)){const result=await resolveQuotes(batch);provider=result.provider??provider;allQuotes.push(...result.quotes);errors.push(...result.errors);}
 const map=new Map(universe.map(r=>[r.providerSymbol.toUpperCase(),r.symbol.toUpperCase()]));
 const quality=validateQuotes(allQuotes.map(q=>({...q,symbol:map.get(q.symbol.toUpperCase())??q.symbol.toUpperCase()})));
 const received=new Set(quality.accepted.map(q=>q.symbol.toUpperCase()));const missing=universe.map(r=>r.symbol.toUpperCase()).filter(s=>!received.has(s));
 const finishedAt=new Date().toISOString();const status=!quality.accepted.length&&errors.length?"PROVIDER_ERROR":missing.length?"PARTIAL":"READY";
 await persistMarketQuotes(runId,quality.accepted);await persistMarketRun({runId,provider,requested:universe.length,received:allQuotes.length,accepted:quality.accepted.length,rejected:quality.rejected.length,missing:missing.length,status,startedAt,finishedAt,errors:[...errors,...quality.rejected.map(x=>`${x.symbol}:${x.reason}`)]});
 return {status,runId,provider,requested:universe.length,received:allQuotes.length,accepted:quality.accepted.length,rejected:quality.rejected.length,missing,errors,startedAt,finishedAt};
}
