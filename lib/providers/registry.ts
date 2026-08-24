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

const can = (provider: MarketDataProvider, capability: ProviderCapability) =>
  provider.capabilities.includes(capability);

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
      errors.push(`${provider.name}: ${error instanceof Error ? error.message : "unknown provider error"}`);
    }
  }

  return {
    provider: null,
    quotes: [] as MarketQuote[],
    fallbackUsed: false,
    errors,
  };
}

export async function resolveIndices(symbols: string[]) {
  const candidates = providers.filter((p) => can(p, "indices"));
  const errors: string[] = [];

  for (const provider of candidates) {
    try {
      const indices = await provider.getIndices(symbols);
      if (indices.length) {
        return {
          provider: provider.name,
          indices,
          fallbackUsed: provider !== candidates[0],
          errors,
        };
      }
    } catch (error) {
      errors.push(`${provider.name}: ${error instanceof Error ? error.message : "unknown provider error"}`);
    }
  }

  return {
    provider: null,
    indices: [] as MarketIndexSnapshot[],
    fallbackUsed: false,
    errors,
  };
}

/**
 * Pulse source resolver.
 *
 * IMPORTANT: an empty stock list does not mean "return no data".
 * It means "build the market pulse from the best available market
 * observations". Quotes are preferred; benchmark indices are the guaranteed
 * fallback for a market-level pulse.
 */
export async function getMarketSnapshots(symbols: string[]) {
  const quotes = await resolveQuotes(symbols);

  if (quotes.quotes.length) {
    return {
      provider: quotes.provider,
      rows: quotes.quotes
        .filter((quote) => quote.price !== null)
        .map((quote): MarketSnapshot => ({
          symbol: quote.symbol,
          exchange: quote.exchange,
          price: quote.price as number,
          previousClose: quote.previousClose ?? undefined,
          open: quote.open ?? undefined,
          high: quote.high ?? undefined,
          low: quote.low ?? undefined,
          volume: quote.volume ?? undefined,
          timestamp: quote.timestamp,
        })),
      fallbackUsed: quotes.fallbackUsed,
      errors: quotes.errors,
    };
  }

  // A market pulse can still be calculated from NIFTY/BANK NIFTY benchmark
  // observations when stock quotes are unavailable.
  const indices = await resolveIndices(["NIFTY 50", "BANK NIFTY", "SENSEX"]);

  return {
    provider: indices.provider ?? quotes.provider,
    rows: indices.indices
      .filter((index) => index.value !== null && index.previousClose !== null)
      .map((index): MarketSnapshot => ({
        symbol: index.name,
        exchange: "NSE",
        price: index.value as number,
        previousClose: index.previousClose as number,
        timestamp: index.timestamp,
      })),
    fallbackUsed: quotes.fallbackUsed || Boolean(indices.fallbackUsed),
    errors: [...quotes.errors, ...indices.errors],
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
