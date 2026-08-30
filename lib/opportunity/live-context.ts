import type { ProviderContext } from "./provider-adapters";

export interface LiveProviderResult {
  context: ProviderContext;
  providerStatus: Record<string, "READY" | "UNAVAILABLE" | "ERROR">;
}

function envEnabled(name: string) {
  return Boolean(process.env[name]);
}

/**
 * Safe aggregation boundary.
 *
 * Provider-specific implementations should be injected here rather than
 * exposing API keys to the browser. Missing credentials/data remain explicit.
 */
export async function getLiveOpportunityContext(
  symbol: string,
): Promise<LiveProviderResult> {
  const statuses: Record<string, "READY" | "UNAVAILABLE" | "ERROR"> = {
    angelOne: envEnabled("ANGELONE_API_KEY") ? "READY" : "UNAVAILABLE",
    indianApi: envEnabled("INDIAN_API_KEY") ? "READY" : "UNAVAILABLE",
    finnhub: envEnabled("FINNHUB_API_KEY") ? "READY" : "UNAVAILABLE",
    alphaVantage: envEnabled("ALPHA_VANTAGE_API_KEY") ? "READY" : "UNAVAILABLE",
    nse: "UNAVAILABLE",
    bse: "UNAVAILABLE",
  };

  return {
    context: {
      quote: null,
      stockScore: null,
      stockConfidence: 0,
      marketPulse: null,
      sectorPulse: null,
      riskShield: null,
      liquidityScore: null,
      entry: null,
      target: null,
      stopLoss: null,
      sources: [],
      errors: [`NO_NORMALIZED_PROVIDER_RESULT:${symbol}`],
    },
    providerStatus: statuses,
  };
}
