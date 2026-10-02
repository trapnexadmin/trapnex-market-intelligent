export interface HistoricalCandleQuery {
  symbol: string;
  exchange: "NSE" | "BSE";
  instrumentToken: string;
  interval: "ONE_DAY" | "ONE_HOUR" | "FIFTEEN_MINUTE" | "FIVE_MINUTE" | "ONE_MINUTE";
  from: string;
  to: string;
}

export interface HistoricalCandleProvider {
  readonly name: string;
  readonly priority: number;
  health(): Promise<{ provider: string; status: "READY" | "NOT_CONFIGURED" | "ERROR"; message?: string }>;
  getHistoricalCandles(query: HistoricalCandleQuery): Promise<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number | null;
  }[]>;
}

export interface FundamentalData {
  symbol: string;
  revenueGrowth: number | null;
  earningsGrowth: number | null;
  roe: number | null;
  roce: number | null;
  debtToEquity: number | null;
  operatingCashFlow: number | null;
  freeCashFlow: number | null;
  profitMargin: number | null;
  asOf: string | null;
  source: string;
}

export interface ValuationData {
  symbol: string;
  pe: number | null;
  pb: number | null;
  evEbitda: number | null;
  earningsGrowth: number | null;
  historicalPePercentile: number | null;
  asOf: string | null;
  source: string;
}
