import { NextResponse } from "next/server";import { getProviderHealth } from "@/lib/providers/registry";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(){const providers=await getProviderHealth();return NextResponse.json({status:providers.some(x=>x.status==="READY")?"READY":"DEGRADED",providers,checkedAt:new Date().toISOString()});}
