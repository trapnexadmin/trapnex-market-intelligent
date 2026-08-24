export type ScoreStatus = "READY" | "INSUFFICIENT_DATA";

export interface StockFactorInput {
  symbol: string;
  fundamentalQuality: number | null;
  technicalStructure: number | null;
  valuation: number | null;
  institutionalFlow: number | null;
  sectorAlignment: number | null;
  newsEvent: number | null;
  riskTrapShield: number | null;
}

export interface StockIntelligenceScore {
  symbol: string;
  score: number | null;
  status: ScoreStatus;
  confidence: number;
  factors: {
    key: string;
    label: string;
    weight: number;
    score: number | null;
    status: "READY" | "MISSING";
  }[];
  calculatedAt: string;
}
