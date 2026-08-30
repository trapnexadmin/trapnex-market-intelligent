import { NextRequest, NextResponse } from "next/server";
import { aggregateProviderContext } from "@/lib/opportunity/aggregate";
import { getAngelOneHistoricalContext } from "@/lib/opportunity/historical-context";
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
        const historical = await getAngelOneHistoricalContext(symbol);

        const context = {
          ...live.context,
          quote: historical.quote
            ? {
                symbol: historical.quote.symbol,
                price: historical.quote.price,
                changePct: null,
                volume: null,
                provider: historical.quote.provider,
                asOf: historical.quote.asOf,
              }
            : live.context.quote,
          entry: historical.entry,
          stopLoss: historical.stopLoss,
          target: historical.target,
          sources: [...new Set([...live.context.sources, ...historical.sources])],
          errors: [...live.context.errors, ...historical.errors],
        };

        const opportunity = aggregateProviderContext(
          symbol,
          context,
          historical.candles,
        );

        return {
          symbol,
          opportunity,
          providerStatus: live.providerStatus,
          sources: context.sources,
          errors: context.errors,
          technical: {
            candleCount: historical.candles.length,
            entry: historical.entry,
            stopLoss: historical.stopLoss,
            target: historical.target,
          },
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
          technical: {
            candleCount: 0,
            entry: null,
            stopLoss: null,
            target: null,
          },
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
    checkedAt: new Date().toISOString(),
  });
}
