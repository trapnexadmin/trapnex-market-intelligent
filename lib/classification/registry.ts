import type { InstrumentClassification } from "./types";
const rows: InstrumentClassification[] = [
  {
    symbol: "RELIANCE",
    exchange: "NSE",
    capBucket: "LARGE",
    sector: "ENERGY",
    source: "SEED_PENDING_REFRESH",
    asOf: new Date().toISOString(),
  },
  {
    symbol: "TCS",
    exchange: "NSE",
    capBucket: "LARGE",
    sector: "IT",
    source: "SEED_PENDING_REFRESH",
    asOf: new Date().toISOString(),
  },
  {
    symbol: "HDFCBANK",
    exchange: "NSE",
    capBucket: "LARGE",
    sector: "BANK",
    source: "SEED_PENDING_REFRESH",
    asOf: new Date().toISOString(),
  },
  {
    symbol: "INFY",
    exchange: "NSE",
    capBucket: "LARGE",
    sector: "IT",
    source: "SEED_PENDING_REFRESH",
    asOf: new Date().toISOString(),
  },
];
export function listClassifications() {
  return rows;
}
export function getClassification(symbol: string) {
  return rows.find((x) => x.symbol === symbol.toUpperCase()) ?? null;
}
export function validateClassification(row: InstrumentClassification) {
  return Boolean(
    row.symbol &&
    row.exchange &&
    row.capBucket &&
    row.sector &&
    row.source &&
    row.asOf,
  );
}
