import type { MarketQuote } from "@/lib/domain/market";
export interface QuoteQualityResult { accepted: MarketQuote[]; rejected: { symbol: string; reason: string }[]; }
export interface MarketSyncResult { status: "READY" | "PARTIAL" | "INSUFFICIENT_DATA" | "PROVIDER_ERROR"; runId: string; provider: string | null; requested: number; received: number; accepted: number; rejected: number; missing: string[]; errors: string[]; startedAt: string; finishedAt: string; }
