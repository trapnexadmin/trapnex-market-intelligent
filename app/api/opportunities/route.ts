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
      try {
        const live = await getLiveOpportunityContext(symbol);
        const opportunity = aggregateProviderContext(symbol, live.context, []);
        return {
          symbol,
          opportunity,
          providerStatus: live.providerStatus,
          sources: live.context.sources,
          errors: live.context.errors,
        };
      } catch (error) {
        return {
          symbol,
          opportunity: null,
          providerStatus: {},
          sources: [],
          errors: [
            error instanceof Error ? error.message : "PROVIDER_ERROR",
          ],
        };
      }
    }),
  );

  const ranked = results
    .filter(
      (item) =>
        item.opportunity &&
        item.opportunity.decision !== "INSUFFICIENT_DATA",
    )
    .sort(
      (a, b) =>
        (b.opportunity?.score ?? -1) - (a.opportunity?.score ?? -1),
    );

  return NextResponse.json({
    status: ranked.length ? "READY" : "INSUFFICIENT_DATA",
    universeSize: symbols.length,
    ranked,
    rejected: results
      .filter(
        (item) =>
          !item.opportunity ||
          item.opportunity.decision === "INSUFFICIENT_DATA",
      )
      .map((item) => item.symbol),
    providerResults: results.map((item) => ({
      symbol: item.symbol,
      providerStatus: item.providerStatus,
      sources: item.sources,
      errors: item.errors,
    })),
    checkedAt: new Date().toISOString(),
  });
}
