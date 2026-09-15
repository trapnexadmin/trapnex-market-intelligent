import type { InstrumentClassification } from "./types";

interface SnapshotRow {
  symbol: string;
  exchange: "NSE" | "BSE";
  cap_bucket: "LARGE" | "MID" | "SMALL" | null;
  sector: string | null;
  source: string;
  effective_date: string | null;
  as_of: string;
}

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const config = getConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`SUPABASE_CLASSIFICATION_${response.status}`);
  return response;
}

export async function persistClassificationSnapshot(rows: InstrumentClassification[]) {
  if (!rows.length) return false;

  const payload: SnapshotRow[] = rows.map((row) => ({
    symbol: row.symbol.toUpperCase(),
    exchange: row.exchange,
    cap_bucket: row.capBucket,
    sector: row.sector,
    source: row.source,
    effective_date: row.effectiveDate,
    as_of: row.asOf,
  }));

  return Boolean(await supabaseRequest("classification_snapshots", {
    method: "POST",
    body: JSON.stringify(payload),
  }));
}

export async function loadLatestClassifications() {
  const response = await supabaseRequest(
    "classification_snapshots?select=symbol,exchange,cap_bucket,sector,source,effective_date,as_of&order=as_of.desc&limit=5000",
  );
  if (!response) return null;

  const rows = (await response.json()) as SnapshotRow[];
  const seen = new Set<string>();

  return rows.filter((row) => {
    const symbol = row.symbol.toUpperCase();
    if (seen.has(symbol)) return false;
    seen.add(symbol);
    return true;
  }).map((row) => ({
    symbol: row.symbol.toUpperCase(),
    exchange: row.exchange,
    capBucket: row.cap_bucket,
    sector: row.sector,
    source: row.source,
    effectiveDate: row.effective_date,
    asOf: row.as_of,
  } satisfies InstrumentClassification));
}
