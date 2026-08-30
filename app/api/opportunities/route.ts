import { NextRequest, NextResponse } from "next/server";
import { aggregateProviderContext } from "@/lib/opportunity/aggregate";
import { getLiveOpportunityContext } from "@/lib/opportunity/live-context";
import { INDIA_LIQUID_UNIVERSE } from "@/lib/opportunity/universe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  const symbols = requested ? [requested] : [...INDIA_LIQUID_UNIVERSE];

  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const live = await getLiveOpportunityContext(symbol);
      const opportunity = aggregateProviderContext(symbol, live.context, []);
      return { symbol, opportunity, providerStatus: live.providerStatus, errors: live.context.errors };
    }),
  );

  const ranked = results
    .filter((item) => item.opportunity.decision !== "INSUFFICIENT_DATA")
    .sort((a, b) => (b.opportunity.score ?? -1) - (a.opportunity.score ?? -1));

  return NextResponse.json({
    status: ranked.length ? "READY" : "INSUFFICIENT_DATA",
    universeSize: symbols.length,
    ranked,
    rejected: results
      .filter((item) => item.opportunity.decision === "INSUFFICIENT_DATA")
      .map((item) => item.symbol),
    checkedAt: new Date().toISOString(),
  });
}
