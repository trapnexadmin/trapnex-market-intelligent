export type CapBucket = "LARGE" | "MID" | "SMALL";

export interface InstrumentClassification {
  symbol:string;
  exchange:"NSE"|"BSE";
  capBucket:CapBucket|null;
  sector:string|null;
  source:string;
  effectiveDate:string|null;
  asOf:string;
}

export interface ClassificationRefreshResult {
  status:"READY"|"INSUFFICIENT_DATA"|"REJECTED";
  accepted:number;
  rejected:number;
  source:string;
  effectiveDate:string|null;
  errors:string[];
}
