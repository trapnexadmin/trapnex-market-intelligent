export type CapBucket = "LARGE" | "MID" | "SMALL";
export interface InstrumentClassification {
  symbol: string;
  exchange: "NSE" | "BSE";
  capBucket: CapBucket | null;
  sector: string | null;
  source: string;
  asOf: string;
}
