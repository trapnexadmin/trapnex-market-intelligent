import { alphaVantageRequest } from "./client";

export interface AlphaOverview {
  Symbol?: string;
  Name?: string;
  PERatio?: string;
  PriceToBookRatio?: string;
  EVToEBITDA?: string;
  ReturnOnEquityTTM?: string;
  ProfitMargin?: string;
  QuarterlyRevenueGrowthYOY?: string;
  QuarterlyEarningsGrowthYOY?: string;
}

export const getOverview = (symbol: string) =>
  alphaVantageRequest<AlphaOverview>({ function: "OVERVIEW", symbol });
