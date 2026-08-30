import { getAngelOneQuote } from "./angelone-adapter";
import { resolveQuote, withQuote } from "./provider-wiring";
import type { ProviderContext } from "./provider-adapters";

export interface LiveProviderResult {
  context: ProviderContext;
  providerStatus: Record<string, "READY" | "UNAVAILABLE" | "ERROR">;
}

function envEnabled(name: string) {
  return Boolean(process.env[name]);
}

export async function getLiveOpportunityContext(
  symbol: string,
): Promise<LiveProviderResult> {
  const providerStatus: Record<
    string,
    "READY" | "UNAVAILABLE" | "ERROR"
  > = {
    angelOne: envEnabled("ANGELONE_API_KEY") ? "READY" : "UNAVAILABLE",
    indianApi: envEnabled("INDIAN_API_KEY") ? "READY" : "UNAVAILABLE",
    finnhub: envEnabled("FINNHUB_API_KEY") ? "READY" : "UNAVAILABLE",
    alphaVantage: envEnabled("ALPHA_VANTAGE_API_KEY")
      ? "READY"
      : "UNAVAILABLE",
    nse: "UNAVAILABLE",
    bse: "UNAVAILABLE",
  };

  const quoteResult = await resolveQuote(symbol, [
    {
      name: "Angel One SmartAPI",
      getQuote: getAngelOneQuote,
    },
  ]);

  if (quoteResult.quote) providerStatus.angelOne = "READY";

  return {
    context: withQuote(
      {
        stockScore: null,
        stockConfidence: 0,
        marketPulse: null,
        sectorPulse: null,
        riskShield: null,
        liquidityScore: null,
        entry: null,
        target: null,
        stopLoss: null,
      },
      quoteResult.quote,
      quoteResult.sources,
      quoteResult.errors,
    ),
    providerStatus,
  };
}
