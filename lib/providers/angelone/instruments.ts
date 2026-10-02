export interface AngelInstrument {
  token: string;
  symbol: string;
  name: string;
  exch_seg: string;
  instrumenttype?: string;
  is_cas_enabled?: boolean;
}

const MASTER_URL =
  "https://margincalculator.angelone.in/OpenAPI_File/files/OpenAPIScripMaster.json";

let cache: AngelInstrument[] | null = null;
let loadedAt = 0;

export async function loadAngelInstruments() {
  if (cache && Date.now() - loadedAt < 12 * 60 * 60 * 1000) return cache;
  const response = await fetch(MASTER_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`ANGEL_INSTRUMENT_MASTER_${response.status}`);
  const rows = (await response.json()) as AngelInstrument[];
  cache = Array.isArray(rows) ? rows : [];
  loadedAt = Date.now();
  return cache;
}

export async function resolveEquityInstrument(symbol: string, exchange: "NSE" | "BSE" = "NSE") {
  const rows = await loadAngelInstruments();
  const target = symbol.trim().toUpperCase();
  const segment = exchange === "BSE" ? "bse_cm" : "nse_cm";
  return rows.find(
    (row) =>
      String(row.exch_seg).toLowerCase() === segment &&
      String(row.symbol).toUpperCase() === `${target}-EQ`,
  ) ?? null;
}
