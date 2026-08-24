import type { ProviderCapability } from "@/lib/domain/provider";
import type { MarketIndexSnapshot, MarketQuote, BreadthSnapshot } from "@/lib/domain/market";
import type { MarketDataProvider } from "./base";
import { AngelOneProvider } from "./angelone/provider";
import { IndianApiProvider } from "./indianapi/provider";

export const providers: MarketDataProvider[] = [
  new AngelOneProvider(),
  new IndianApiProvider(),
].sort((a, b) => a.priority - b.priority);

const can = (p: MarketDataProvider, c: ProviderCapability) => p.capabilities.includes(c);

export async function getProviderHealth() {
  return Promise.all(providers.map((provider) => provider.health()));
}

export async function resolveQuotes(symbols: string[]) {
  const candidates = providers.filter((p) => can(p, "quotes"));
  const errors: string[] = [];
  for (const provider of candidates) {
    try {
      const quotes = await provider.getQuotes(symbols);
      if (quotes.length) return { provider: provider.name, quotes, fallbackUsed: provider !== candidates[0], errors };
    } catch (e) {
      errors.push(`${provider.name}: ${e instanceof Error ? e.message : "unknown error"}`);
    }
  }
  return { provider: null, quotes: [] as MarketQuote[], fallbackUsed: false, errors };
}

export async function resolveIndices(symbols: string[]) {
  const candidates = providers.filter((p) => can(p, "indices"));
  for (const provider of candidates) {
    try {
      const indices = await provider.getIndices(symbols);
      if (indices.length) return { provider: provider.name, indices, fallbackUsed: provider !== candidates[0] };
    } catch {}
  }
  return { provider: null, indices: [] as MarketIndexSnapshot[], fallbackUsed: false };
}

export async function resolveBreadth(market: string) {
  const candidates = providers.filter((p) => can(p, "breadth"));
  for (const provider of candidates) {
    try {
      const breadth = await provider.getBreadth(market);
      if (breadth) return { provider: provider.name, breadth, fallbackUsed: provider !== candidates[0] };
    } catch {}
  }
  return { provider: null, breadth: null as BreadthSnapshot | null, fallbackUsed: false };
}
