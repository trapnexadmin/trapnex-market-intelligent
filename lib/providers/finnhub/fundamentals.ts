import { finnhubRequest } from "./client";

export interface FinnhubProfile {
  ticker?: string;
  name?: string;
  exchange?: string;
  finnhubIndustry?: string;
  marketCapitalization?: number;
}

export interface FinnhubMetric {
  metric?: Record<string, number | string | null>;
}

export const getCompanyProfile = (symbol: string) =>
  finnhubRequest<FinnhubProfile>("/stock/profile2", { symbol });

export const getBasicFinancials = (symbol: string) =>
  finnhubRequest<FinnhubMetric>("/stock/metric", { symbol, metric: "all" });
