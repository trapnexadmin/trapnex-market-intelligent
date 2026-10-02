import type { FundamentalSnapshot, ValuationSnapshot, InstitutionalFlowSnapshot } from "@/lib/stock-intelligence/factors/types";

export interface FundamentalProviderResult {
  provider: string;
  asOf: string | null;
  fundamentals: FundamentalSnapshot;
  valuation: ValuationSnapshot;
  institutionalFlow: InstitutionalFlowSnapshot;
  raw?: unknown;
}

export interface FundamentalDataProvider {
  readonly name: string;
  readonly priority: number;
  health(): Promise<{ provider: string; status: "READY"|"NOT_CONFIGURED"|"ERROR"; message?: string }>;
  getFundamentals(input: { symbol: string; isin: string }): Promise<FundamentalProviderResult | null>;
}
