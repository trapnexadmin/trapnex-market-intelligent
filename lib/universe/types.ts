export type EquityExchange = "NSE" | "BSE";
export type CapBucket = "LARGE" | "MID" | "SMALL";

export interface EquityUniverseRow {
  symbol: string;
  exchange: EquityExchange;
  providerSymbol: string;
  companyName: string;
  isin: string | null;
  capBucket: CapBucket | null;
  sector: string | null;
  industry: string | null;
  active: boolean;
  listed: boolean;
  source: string;
  effectiveDate: string | null;
  asOf: string;
}
