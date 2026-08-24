import type { ValuationSnapshot } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function calculateValuation(input: ValuationSnapshot): number | null {
  const values: number[] = [];

  if (input.pe !== null && input.pe > 0) {
    values.push(clamp(100 - Math.min(input.pe / 60, 1) * 100));
  }

  if (input.pb !== null && input.pb > 0) {
    values.push(clamp(100 - Math.min(input.pb / 10, 1) * 100));
  }

  if (input.evEbitda !== null && input.evEbitda > 0) {
    values.push(clamp(100 - Math.min(input.evEbitda / 40, 1) * 100));
  }

  if (input.historicalPePercentile !== null) {
    values.push(clamp(100 - input.historicalPePercentile));
  }

  if (input.earningsGrowth !== null) {
    values.push(clamp(50 + input.earningsGrowth));
  }

  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
