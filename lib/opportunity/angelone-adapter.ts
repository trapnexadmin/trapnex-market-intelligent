import { getLtpData } from "@/lib/providers/angelone/quotes";
import { normalizeQuote } from "./provider-adapters";
import type { ProviderQuote } from "./provider-adapters";

/**
 * Thin adapter around the repository's existing Angel One implementation.
 *
 * Symbol-token resolution belongs to the existing instrument master/provider
 * layer. Configure ANGELONE_SYMBOL_TOKEN_<SYMBOL> server-side for the initial
 * adapter until the instrument resolver is wired.
 */
export async function getAngelOneQuote(
  symbol: string,
): Promise<ProviderQuote | null> {
  const token = process.env[`ANGELONE_SYMBOL_TOKEN_${symbol}`];
  if (!token) return null;

  const quote = await getLtpData({
    exchange: "NSE",
    tradingsymbol: symbol,
    symboltoken: token,
  });

  return normalizeQuote(
    {
      symbol: quote.symbol,
      price: quote.price,
      changePct:
        quote.previousClose && quote.previousClose > 0
          ? ((quote.price - quote.previousClose) / quote.previousClose) * 100
          : null,
      volume: quote.volume,
      asOf: quote.timestamp,
    },
    quote.provider,
  );
}
