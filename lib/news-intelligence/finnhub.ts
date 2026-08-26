import { finnhubRequest } from "@/lib/providers/finnhub/client";
import type { NewsEvent } from "./types";

export async function getCompanyNewsEvents(symbol: string): Promise<NewsEvent[]> {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 7);

  const rows = await finnhubRequest<any[]>("/company-news", {
    symbol,
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  });

  return (Array.isArray(rows) ? rows : []).slice(0, 50).map((row: any, index) => ({
    id: String(row.id ?? `${symbol}-${index}-${row.datetime ?? Date.now()}`),
    scope: "STOCK",
    symbol,
    sector: null,
    headline: String(row.headline ?? ""),
    summary: String(row.summary ?? "") || null,
    url: String(row.url ?? "") || null,
    provider: "Finnhub",
    publishedAt: row.datetime
      ? new Date(Number(row.datetime) * 1000).toISOString()
      : null,
    sentiment: null,
    materiality: null,
    impact: null,
    quality: "LIVE",
  }));
}
