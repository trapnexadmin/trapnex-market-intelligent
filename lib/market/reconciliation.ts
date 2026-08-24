import type { MarketQuote, MarketIndexSnapshot } from "@/lib/domain/market";

export interface ReconciledQuote extends MarketQuote {
  sourceCount: number;
  sourceProviders: string[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  conflict: boolean;
  maxPriceDeviationPercent: number | null;
}

export function reconcileQuotes(quotes: MarketQuote[]): ReconciledQuote[] {
  const groups = new Map<string, MarketQuote[]>();

  for (const quote of quotes) {
    const key = `${quote.exchange}:${quote.symbol.toUpperCase()}`;
    const list = groups.get(key) ?? [];
    list.push(quote);
    groups.set(key, list);
  }

  return [...groups.values()].map((group) => {
    const valid = group.filter((q) => q.price !== null) as (MarketQuote & { price: number })[];
    const prices = valid.map((q) => q.price);
    const min = prices.length ? Math.min(...prices) : null;
    const max = prices.length ? Math.max(...prices) : null;
    const median = prices.length ? [...prices].sort((a,b) => a-b)[Math.floor(prices.length / 2)] : null;
    const deviation = min !== null && max !== null && median ? ((max - min) / median) * 100 : null;
    const conflict = deviation !== null && deviation > 0.25;

    const selected = valid.find((q) => q.provider === "Angel One SmartAPI") ?? valid[0];
    return {
      ...selected,
      price: median,
      sourceCount: valid.length,
      sourceProviders: [...new Set(valid.map((q) => q.provider))],
      confidence: conflict ? "LOW" : valid.length >= 2 ? "HIGH" : "MEDIUM",
      conflict,
      maxPriceDeviationPercent: deviation,
    };
  });
}

export function reconcileIndices(indices: MarketIndexSnapshot[]) {
  const groups = new Map<string, MarketIndexSnapshot[]>();
  for (const index of indices) {
    const key = index.name.toUpperCase();
    const list = groups.get(key) ?? [];
    list.push(index);
    groups.set(key, list);
  }

  return [...groups.values()].map((group) => {
    const valid = group.filter((x) => x.value !== null) as (MarketIndexSnapshot & { value: number })[];
    const values = valid.map((x) => x.value).sort((a,b) => a-b);
    const median = values.length ? values[Math.floor(values.length / 2)] : null;
    return {
      ...valid[0],
      value: median,
      sourceCount: valid.length,
      sourceProviders: [...new Set(valid.map((x) => x.provider))],
      confidence: valid.length >= 2 ? "HIGH" : "MEDIUM",
    };
  });
}
