import type { FundamentalSnapshot, InstitutionalFlowSnapshot, ValuationSnapshot } from "../factors/types";

export const EMPTY_FUNDAMENTALS: FundamentalSnapshot = {
  revenueGrowth: null,
  earningsGrowth: null,
  roe: null,
  roce: null,
  debtToEquity: null,
  operatingCashFlow: null,
  freeCashFlow: null,
  profitMargin: null,
};

export const EMPTY_VALUATION: ValuationSnapshot = {
  pe: null,
  pb: null,
  evEbitda: null,
  earningsGrowth: null,
  historicalPePercentile: null,
};

export const EMPTY_INSTITUTIONAL_FLOW: InstitutionalFlowSnapshot = {
  fiiNet: null,
  diiNet: null,
  deliveryRatio: null,
  institutionalOwnershipChange: null,
};
