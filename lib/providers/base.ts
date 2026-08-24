import type { BreadthSnapshot, MarketIndexSnapshot, MarketQuote } from "@/lib/domain/market";
import type { ProviderCapability, ProviderHealth } from "@/lib/domain/provider";

export interface MarketDataProvider {
  readonly name: string;
  readonly priority: number;
  readonly capabilities: ProviderCapability[];
  health(): Promise<ProviderHealth>;
  getQuotes(symbols: string[]): Promise<MarketQuote[]>;
  getIndices(symbols: string[]): Promise<MarketIndexSnapshot[]>;
  getBreadth(market: string): Promise<BreadthSnapshot | null>;
}
