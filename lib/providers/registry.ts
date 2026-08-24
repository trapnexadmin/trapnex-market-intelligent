import type { ProviderCapability } from "@/lib/domain/provider";
import type { MarketIndexSnapshot, MarketQuote, BreadthSnapshot } from "@/lib/domain/market";
import type { MarketDataProvider } from "./base";
import type { MarketSnapshot } from "@/lib/intelligence/types";
import { AngelOneProvider } from "./angelone/provider";
import { IndianApiProvider } from "./indianapi/provider";

export const providers: MarketDataProvider[] = [
  new AngelOneProvider(),
  new IndianApiProvider(),
].sort((a, b) => a.priority - b.priority);

const can = (p: MarketDataProvider, c: ProviderCapability) =>
  p.capabilities.includes(c);

export async function getProviderHealth() {
  return Promise.all(providers.map((provider) => provider.health()));
}

export async function resolveQuotes(symbols: string[]) {
  const candidates = providers.filter((p) => can(p, "quotes"));
  const errors: string[] = [];

  for (const provider of candidates) {
    try {
      const quotes = await provider.getQuotes(symbols);
      if (quotes.length) {
        return {
          provider: provider.name,
          quotes,
          fallbackUsed: provider !== candidates[0],
          errors,
        };
      }
    } catch (error) {
      errors.push(
        `${provider.name}: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }
  }

  return {
    provider: null,
    quotes: [] as MarketQuote[],
    fallbackUsed: false,
    errors,
  };
}

/**
 * Compatibility adapter used by the existing intelligence/pulse route.
 * Provider-specific models stay behind the provider layer.
 */
export async function getMarketSnapshots(symbols: string[]) {
  const result = await resolveQuotes(symbols);

  const rows: MarketSnapshot[] = result.quotes.map((quote) => ({
    symbol: quote.symbol,
    exchange: quote.exchange,
    price: quote.price as number,
    previousClose: quote.previousClose ?? undefined,
    open: quote.open ?? undefined,
    high: quote.high ?? undefined,
    low: quote.low ?? undefined,
    volume: quote.volume ?? undefined,
    timestamp: quote.timestamp,
  }));

  return {
    provider: result.provider,
    rows,
    fallbackUsed: result.fallbackUsed,
    errors: result.errors,
  };
}

export async function resolveIndices(symbols: string[]) {
  const candidates = providers.filter((p) => can(p, "indices"));

  for (const provider of candidates) {
    try {
      const indices = await provider.getIndices(symbols);
      if (indices.length) {
        return {
          provider: provider.name,
          indices,
          fallbackUsed: provider !== candidates[0],
        };
      }
    } catch {}
  }

  return {
    provider: null,
    indices: [] as MarketIndexSnapshot[],
    fallbackUsed: false,
  };
}

export async function resolveBreadth(market: string) {
  const candidates = providers.filter((p) => can(p, "breadth"));

  for (const provider of candidates) {
    try {
      const breadth = await provider.getBreadth(market);
      if (breadth) {
        return {
          provider: provider.name,
          breadth,
          fallbackUsed: provider !== candidates[0],
        };
      }
    } catch {}
  }

  return {
    provider: null,
    breadth: null as BreadthSnapshot | null,
    fallbackUsed: false,
  };
}
