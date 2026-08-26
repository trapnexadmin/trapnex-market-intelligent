import { getBasicFinancials, getCompanyProfile } from "@/lib/providers/finnhub/fundamentals";
import { getOverview } from "@/lib/providers/alphavantage/fundamentals";

const num = (v: unknown) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export async function getFundamentalValuationInputs(symbol: string) {
  let profile = null;
  let finnhub = null;
  let alphaVantage = null;
  const errors: string[] = [];

  try { profile = await getCompanyProfile(symbol); }
  catch (e) { errors.push(`Finnhub profile: ${e instanceof Error ? e.message : "unavailable"}`); }

  try { finnhub = await getBasicFinancials(symbol); }
  catch (e) { errors.push(`Finnhub fundamentals: ${e instanceof Error ? e.message : "unavailable"}`); }

  try { alphaVantage = await getOverview(symbol); }
  catch (e) { errors.push(`Alpha Vantage overview: ${e instanceof Error ? e.message : "unavailable"}`); }

  const metric = finnhub?.metric ?? {};
  return {
    profile,
    fundamentals: {
      revenueGrowth: num(alphaVantage?.QuarterlyRevenueGrowthYOY),
      earningsGrowth: num(alphaVantage?.QuarterlyEarningsGrowthYOY),
      roe: num(alphaVantage?.ReturnOnEquityTTM),
      roce: null,
      debtToEquity: null,
      operatingCashFlow: null,
      freeCashFlow: null,
      profitMargin: num(alphaVantage?.ProfitMargin) ?? num(metric.profitMarginTTM),
    },
    valuation: {
      pe: num(alphaVantage?.PERatio) ?? num(metric.peBasicExclExtraTTM),
      pb: num(alphaVantage?.PriceToBookRatio),
      evEbitda: num(alphaVantage?.EVToEBITDA),
      earningsGrowth: num(alphaVantage?.QuarterlyEarningsGrowthYOY) ?? num(metric.epsGrowth5Y),
      historicalPePercentile: null,
    },
    errors,
  };
}
