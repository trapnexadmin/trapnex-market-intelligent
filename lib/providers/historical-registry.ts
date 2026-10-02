import { AngelOneHistoricalProvider } from "./angelone/candle-provider";
import type { HistoricalCandleQuery } from "./types";

const providers = [
  new AngelOneHistoricalProvider(),
].sort((a, b) => a.priority - b.priority);

export interface HistoricalProviderHealth {
  provider: string;
  status: "READY" | "ERROR";
  message?: string;
}

export async function getHistoricalProviderHealth(): Promise<HistoricalProviderHealth[]> {
  return Promise.all(
    providers.map(async (provider) => {
      try {
        const health = await provider.health();
        return {
          provider: provider.name,
          status: health.status === "READY"
            ? ("READY" as const)
            : ("ERROR" as const),
          ...(health.message ? { message: health.message } : {}),
        };
      } catch (error) {
        return {
          provider: provider.name,
          status: "ERROR" as const,
          message:
            error instanceof Error
              ? error.message
              : "HISTORICAL_PROVIDER_HEALTH_ERROR",
        };
      }
    }),
  );
}

export async function resolveHistoricalCandles(query: HistoricalCandleQuery) {
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const candles = await provider.getHistoricalCandles(query);
      if (candles.length) {
        return {
          provider: provider.name,
          candles,
          errors,
        };
      }

      errors.push(`${provider.name}:NO_CANDLES`);
    } catch (error) {
      errors.push(
        `${provider.name}:${
          error instanceof Error
            ? error.message
            : "unknown historical-data error"
        }`,
      );
    }
  }

  return {
    provider: null,
    candles: [],
    errors,
  };
}
