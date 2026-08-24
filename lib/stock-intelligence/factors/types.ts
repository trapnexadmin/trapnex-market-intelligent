export interface Candle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
}

export interface FundamentalSnapshot {
  revenueGrowth: number | null;
  earningsGrowth: number | null;
  roe: number | null;
  roce: number | null;
  debtToEquity: number | null;
  operatingCashFlow: number | null;
  freeCashFlow: number | null;
  profitMargin: number | null;
}

export interface ValuationSnapshot {
  pe: number | null;
  pb: number | null;
  evEbitda: number | null;
  earningsGrowth: number | null;
  historicalPePercentile: number | null;
}

export interface InstitutionalFlowSnapshot {
  fiiNet: number | null;
  diiNet: number | null;
  deliveryRatio: number | null;
  institutionalOwnershipChange: number | null;
}
