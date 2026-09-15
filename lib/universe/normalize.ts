import type { EquityExchange, EquityUniverseRow } from "./types";

export function normalizeSymbol(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export function normalizeExchange(value: string): EquityExchange {
  return value.trim().toUpperCase() === "BSE" ? "BSE" : "NSE";
}

export function normalizeUniverseRow(
  row: Partial<EquityUniverseRow> & { symbol: string; companyName: string },
): EquityUniverseRow {
  const symbol = normalizeSymbol(row.symbol);
  const exchange = normalizeExchange(row.exchange ?? "NSE");

  return {
    symbol,
    exchange,
    providerSymbol: normalizeSymbol(row.providerSymbol ?? symbol),
    companyName: row.companyName.trim(),
    isin: row.isin?.trim() || null,
    capBucket: row.capBucket ?? null,
    sector: row.sector?.trim() || null,
    industry: row.industry?.trim() || null,
    active: row.active ?? true,
    listed: row.listed ?? true,
    source: row.source?.trim() || "UNKNOWN",
    effectiveDate: row.effectiveDate ?? null,
    asOf: row.asOf ?? new Date().toISOString(),
  };
}

export function deduplicateUniverse(rows: EquityUniverseRow[]) {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = `${row.exchange}:${row.symbol}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
