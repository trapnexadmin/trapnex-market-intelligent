export type Exchange = "NSE" | "BSE";
export type InstrumentType = "EQUITY" | "INDEX" | "ETF" | "FUTURE" | "OPTION";

export interface MarketQuote {
  symbol: string;
  exchange: Exchange;
  instrumentToken?: string;
  instrumentType: InstrumentType;
  price: number | null;
  previousClose: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  timestamp: string;
  provider: string;
}

export interface MarketIndexSnapshot {
  symbol: string;
  name: string;
  value: number | null;
  previousClose: number | null;
  change: number | null;
  changePercent: number | null;
  timestamp: string;
  provider: string;
}

export interface BreadthSnapshot {
  market: string;
  advancers: number | null;
  decliners: number | null;
  unchanged: number | null;
  total: number | null;
  above20dma: number | null;
  above50dma: number | null;
  above200dma: number | null;
  timestamp: string;
  provider: string;
}
