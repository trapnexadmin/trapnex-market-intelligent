import { NextResponse } from "next/server";import { listUniverse } from "@/lib/universe/registry";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(){const universe=listUniverse({activeOnly:true});return NextResponse.json({status:universe.length?"READY":"INSUFFICIENT_DATA",total:universe.length,checkedAt:new Date().toISOString(),note:"Coverage becomes populated after /api/market/sync writes market_quotes."});}
