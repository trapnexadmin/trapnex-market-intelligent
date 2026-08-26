export type NewsScope = "STOCK" | "SECTOR" | "MARKET" | "GLOBAL";
export type NewsQuality = "LIVE" | "RECENT" | "STALE" | "UNAVAILABLE";

export interface NewsEvent {
  id: string;
  scope: NewsScope;
  symbol: string | null;
  sector: string | null;
  headline: string;
  summary: string | null;
  url: string | null;
  provider: string;
  publishedAt: string | null;
  sentiment: number | null;
  materiality: number | null;
  impact: number | null;
  quality: NewsQuality;
}

export interface DangerSignal {
  symbol: string | null;
  scope: NewsScope;
  score: number | null;
  level: "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT_DATA";
  reasons: string[];
  sourceCount: number;
  calculatedAt: string;
}
