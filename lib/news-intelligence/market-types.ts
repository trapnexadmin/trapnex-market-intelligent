export type MarketNewsScope = "GLOBAL" | "INDIA";

export interface MarketNewsEvent {
  id: string;
  scope: MarketNewsScope;
  title: string;
  summary: string | null;
  url: string | null;
  source: string;
  publishedAt: string;
  dangerScore: number | null;
}

export interface MarketNewsContext {
  globalDanger: number | null;
  indiaDanger: number | null;
  events: MarketNewsEvent[];
  provider: string | null;
  checkedAt: string;
  errors: string[];
}
