import type { ProviderContext, ProviderQuote } from "./provider-adapters";

export interface QuoteAdapter {
  name: string;
  getQuote: (symbol: string) => Promise<ProviderQuote | null>;
}

function isValidQuote(q: ProviderQuote | null): q is ProviderQuote {
  return Boolean(
    q &&
    q.symbol &&
    q.price !== null &&
    Number.isFinite(q.price) &&
    q.price > 0,
  );
}

/**
 * Uses adapters in priority order. A failed provider never prevents fallback.
 * API keys stay on the server because adapters are server-only.
 */
export async function resolveQuote(
  symbol: string,
  adapters: QuoteAdapter[],
) {
  const errors: string[] = [];
  const sources: string[] = [];

  for (const adapter of adapters) {
    try {
      const quote = await adapter.getQuote(symbol);
      if (isValidQuote(quote)) {
        sources.push(adapter.name);
        return { quote, sources, errors };
      }
      errors.push(`${adapter.name}:NO_VALID_QUOTE`);
    } catch (error) {
      errors.push(
        `${adapter.name}:${error instanceof Error ? error.message : "UNKNOWN_ERROR"}`,
      );
    }
  }

  return { quote: null, sources, errors };
}

export function withQuote(
  context: Omit<ProviderContext, "quote" | "sources" | "errors">,
  quote: ProviderQuote | null,
  sources: string[],
  errors: string[],
): ProviderContext {
  return { ...context, quote, sources, errors };
}
