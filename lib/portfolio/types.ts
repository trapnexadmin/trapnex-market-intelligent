export type PortfolioRiskProfile = "CONSERVATIVE" | "BALANCED" | "GROWTH";
export type PortfolioCapBucket = "LARGE" | "MID" | "SMALL";

export interface PortfolioCandidate {
  symbol: string;
  score: number | null;
  confidence: number;
  expectedReturnPct: number | null;
  riskShield: number | null;
  liquidityScore: number | null;
  capBucket: PortfolioCapBucket | null;
  sector: string | null;
  eligible: boolean;
  reasons: string[];
}
export interface PortfolioAllocation {
  symbol: string;
  capBucket: PortfolioCapBucket | null;
  sector: string | null;
  weightPct: number;
  amount: number;
  score: number | null;
  expectedReturnPct: number | null;
  confidence: number;
  riskShield: number | null;
  liquidityScore: number | null;
  reasons: string[];
}
export interface PortfolioAllocationPlan {
  capital: number;
  riskProfile: PortfolioRiskProfile;
  allocations: PortfolioAllocation[];
  unallocatedAmount: number;
  capExposurePct: Record<PortfolioCapBucket, number>;
  sectorExposurePct: Record<string, number>;
  constraints: {
    minPerStockPct: number;
    maxPerStockPct: number;
    maxStocks: number;
    capLimitsPct: Record<PortfolioCapBucket, number>;
  };
  warnings: string[];
}