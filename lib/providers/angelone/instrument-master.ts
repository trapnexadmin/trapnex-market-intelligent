import { ANGEL_ONE_INSTRUMENT_MASTER } from "./constants";
import type { AngelInstrument } from "./types";

let cache: { loadedAt: number; instruments: AngelInstrument[] } | null = null;

const TTL = 24 * 60 * 60 * 1000;

function normalize(row: any): AngelInstrument {
  return {
    token: String(row.token ?? ""),
    symbol: String(row.symbol ?? ""),
    name: String(row.name ?? ""),
    expiry: String(row.expiry ?? ""),
    strike: String(row.strike ?? ""),
    lotsize: String(row.lotsize ?? "1"),
    instrumenttype: String(row.instrumenttype ?? ""),
    exch_seg: String(row.exch_seg ?? ""),
    tick_size: String(row.tick_size ?? ""),
    is_fno: ["nfo_fo", "bfo_fo", "mcx_fo"].includes(String(row.exch_seg).toLowerCase()),
  };
}

export async function loadInstrumentMaster(force = false): Promise<AngelInstrument[]> {
  if (!force && cache && Date.now() - cache.loadedAt < TTL) {
    return cache.instruments;
  }

  const response = await fetch(ANGEL_ONE_INSTRUMENT_MASTER, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Angel One instrument master failed (${response.status})`);
  }

  const rows = await response.json();

  if (!Array.isArray(rows)) {
    throw new Error("Angel One instrument master returned an invalid payload");
  }

  const instruments = rows.map(normalize).filter((x) => x.token && x.symbol && x.exch_seg);

  cache = { loadedAt: Date.now(), instruments };
  return instruments;
}

export async function findInstrument(params: {
  symbol?: string;
  token?: string;
  exchangeSegment?: string;
}) {
  const instruments = await loadInstrumentMaster();

  const symbol = params.symbol?.toUpperCase();
  const token = params.token;
  const exchange = params.exchangeSegment?.toLowerCase();

  return instruments.find((item) =>
    (!symbol || item.symbol.toUpperCase() === symbol) &&
    (!token || item.token === token) &&
    (!exchange || item.exch_seg.toLowerCase() === exchange),
  ) ?? null;
}

export async function searchInstruments(query: string, limit = 30) {
  const instruments = await loadInstrumentMaster();
  const q = query.trim().toUpperCase();

  if (!q) return [];

  return instruments
    .filter((item) =>
      item.symbol.toUpperCase().includes(q) ||
      item.name.toUpperCase().includes(q) ||
      item.token === q,
    )
    .slice(0, limit);
}
