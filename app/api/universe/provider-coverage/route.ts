import { NextResponse } from "next/server";
import { getMarketSnapshots } from "@/lib/providers/registry";
import { ensureClassificationsLoaded } from "@/lib/classification/bootstrap";
import { buildProviderCoverage, calculateProviderCoverage } from "@/lib/universe/provider-coverage";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(){
  try{
    const market=await getMarketSnapshots([]);
    const classifications=await ensureClassificationsLoaded();
    const rows=buildProviderCoverage(market.rows,classifications);
    const coverage=calculateProviderCoverage(rows);

    return NextResponse.json({
      status: classifications.length ? "READY" : "INSUFFICIENT_DATA",
      provider: market.provider,
      coverage,
      rows,
      errors: market.errors,
      checkedAt:new Date().toISOString(),
    });
  }catch(error){
    return NextResponse.json({
      status:"PROVIDER_ERROR",
      error:error instanceof Error?error.message:"PROVIDER_COVERAGE_ERROR",
      checkedAt:new Date().toISOString(),
    },{status:503});
  }
}
