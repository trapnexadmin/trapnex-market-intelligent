import type { MarketQuote } from "@/lib/domain/market";
import { calculateBreadth } from "./calculate";
import type { BreadthInputRow, MarketBreadth } from "./types";

/**
 * Build breadth from normalized quote rows when current-price and
 * previous-close data are available.
 *
 * DMA fields remain nullable until historical candles are connected.
 * The function deliberately does not invent DMA values.
 */
export function calculateBreadthFromQuotes(
  market: string,
  quotes: MarketQuote[],
): MarketBreadth {
  const rows: BreadthInputRow[] = quotes
    .filter(
      (quote) =>
        quote.price !== null &&
        quote.previousClose !== null,
    )
    .map((quote) => ({
      symbol: quote.symbol,
      price: quote.price as number,
      previousClose: quote.previousClose,
      dma20: null,
      dma50: null,
      dma200: null,
      volume: quote.volume,
      averageVolume20: null,
    }));

  return calculateBreadth(market, rows);
}
