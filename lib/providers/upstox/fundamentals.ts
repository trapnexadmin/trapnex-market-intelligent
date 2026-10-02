import { upstoxRequest } from "./client";
import type { FundamentalProviderResult } from "../fundamentals/types";

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function latestSeriesValue(row: any): number | null {
  if (!row) return null;
  if (Array.isArray(row)) {
    const vals = row.map((x:any)=>num(x?.value ?? x?.amount)).filter((x): x is number => x !== null);
    return vals.at(-1) ?? null;
  }
  return num(row.value ?? row.amount);
}

export async function getUpstoxFundamentals(isin: string): Promise<FundamentalProviderResult | null> {
  const token = process.env.UPSTOX_ACCESS_TOKEN;
  if (!token || !isin) return null;

  const [ratiosRes, incomeRes, balanceRes, cashRes] = await Promise.all([
    upstoxRequest(`/fundamentals/${encodeURIComponent(isin)}/key-ratios`, token),
    upstoxRequest(`/fundamentals/${encodeURIComponent(isin)}/income-statement?type=consolidated&time_period=yearly`, token),
    upstoxRequest(`/fundamentals/${encodeURIComponent(isin)}/balance-sheet?type=consolidated`, token),
    upstoxRequest(`/fundamentals/${encodeURIComponent(isin)}/cash-flow?type=consolidated`, token),
  ]);

  const r = ratiosRes?.data?.key_ratios ?? ratiosRes?.data ?? {};
  const income = incomeRes?.data?.income_statement ?? incomeRes?.data ?? {};
  const balance = balanceRes?.data?.balance_sheet ?? balanceRes?.data ?? {};
  const cash = cashRes?.data?.cash_flow ?? cashRes?.data ?? {};

  const revenue = latestSeriesValue(income?.revenue);
  const revenueGrowth = num(income?.revenue?.at?.(-1)?.percentage_change ?? income?.revenue_growth);
  const earningsGrowth = num(income?.net_profit?.at?.(-1)?.percentage_change ?? income?.profit_growth);

  return {
    provider: "Upstox Fundamentals",
    asOf: new Date().toISOString(),
    fundamentals: {
      revenueGrowth,
      earningsGrowth,
      roe: num(r?.roe),
      roce: num(r?.roce),
      debtToEquity: num(r?.debt_to_equity ?? r?.de),
      operatingCashFlow: latestSeriesValue(cash?.operating_cash_flow),
      freeCashFlow: latestSeriesValue(cash?.free_cash_flow),
      profitMargin: num(r?.net_profit_margin ?? r?.profit_margin),
    },
    valuation: {
      pe: num(r?.pe),
      pb: num(r?.pb),
      evEbitda: num(r?.ev_ebitda),
      earningsGrowth,
      historicalPePercentile: null,
    },
    institutionalFlow: {
      fiiNet: null,
      diiNet: null,
      deliveryRatio: null,
      institutionalOwnershipChange: null,
    },
    raw: { ratios: ratiosRes, income: incomeRes, balance: balanceRes, cash: cashRes, revenue },
  };
}
