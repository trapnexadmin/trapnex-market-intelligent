import { NextResponse } from "next/server";import { syncUniverseQuotes } from "@/lib/market-data/sync";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(){try{const result=await syncUniverseQuotes();return NextResponse.json(result,{status:result.status==="PROVIDER_ERROR"?503:200});}catch(error){return NextResponse.json({status:"PROVIDER_ERROR",error:error instanceof Error?error.message:"MARKET_SYNC_ERROR"},{status:503});}}
