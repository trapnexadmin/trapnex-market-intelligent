import type { EquityUniverseRow } from "./types";

let universe: EquityUniverseRow[] = [];

export function replaceUniverse(rows: EquityUniverseRow[]) {
  universe = [...rows];
}

export function listUniverse(options?: { activeOnly?: boolean }) {
  const activeOnly = options?.activeOnly ?? true;
  return activeOnly ? universe.filter((row) => row.active && row.listed) : [...universe];
}

export function getUniverseSymbol(symbol: string, exchange?: string) {
  const normalized = symbol.trim().toUpperCase();
  return universe.find(
    (row) =>
      row.symbol === normalized &&
      (!exchange || row.exchange === exchange.toUpperCase()),
  ) ?? null;
}

export function universeSize() {
  return universe.length;
}
