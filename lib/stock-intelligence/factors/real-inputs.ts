export interface RealStockFactorInputs {
  fundamentals: {
    revenueGrowth: number | null;
    earningsGrowth: number | null;
    roe: number | null;
    roce: number | null;
    debtToEquity: number | null;
    operatingCashFlow: number | null;
    freeCashFlow: number | null;
    profitMargin: number | null;
  };
  valuation: {
    pe: number | null;
    pb: number | null;
    evEbitda: number | null;
    earningsGrowth: number | null;
    historicalPePercentile: number | null;
  };
  institutional: {
    fiiNet: number | null;
    diiNet: number | null;
    deliveryRatio: number | null;
    institutionalOwnershipChange: number | null;
  };
}

export interface FactorSource {
  factor: string;
  provider: string | null;
  fetchedAt: string | null;
  quality: "LIVE" | "RECENT" | "STALE" | "UNAVAILABLE";
}
