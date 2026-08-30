import { finnhubRequest } from "@/lib/providers/finnhub/client";
import type { NewsEvent } from "./types";

export async function getMarketNews(): Promise<NewsEvent[]> {
  const rows = await finnhubRequest<any[]>("/news", { category: "general" });
  return (Array.isArray(rows) ? rows : []).slice(0, 80).map((row:any, index:number) => ({
    id: String(row.id ?? `market-${index}-${row.datetime ?? Date.now()}`),
    scope: "MARKET",
    symbol: null,
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

export async function getGlobalNews(): Promise<NewsEvent[]> {
  const rows = await finnhubRequest<any[]>("/news", { category: "general" });
  return (Array.isArray(rows) ? rows : []).slice(0, 80).map((row:any, index:number) => ({
    id: String(row.id ?? `global-${index}-${row.datetime ?? Date.now()}`),
    scope: "GLOBAL",
    symbol: null,
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
