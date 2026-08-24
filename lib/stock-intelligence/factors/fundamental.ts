import type { FundamentalSnapshot } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const normalize = (value: number | null, low: number, high: number) =>
  value === null || !Number.isFinite(value)
    ? null
    : clamp(((value - low) / (high - low)) * 100);

export function calculateFundamentalQuality(
  input: FundamentalSnapshot,
): number | null {
  const values = [
    normalize(input.revenueGrowth, -10, 30),
    normalize(input.earningsGrowth, -15, 40),
    normalize(input.roe, 0, 30),
    normalize(input.roce, 0, 30),
    input.debtToEquity === null
      ? null
      : clamp(100 - input.debtToEquity * 35),
    normalize(input.operatingCashFlow, -1, 5),
    normalize(input.freeCashFlow, -1, 5),
    normalize(input.profitMargin, 0, 30),
  ].filter((v): v is number => v !== null);

  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
