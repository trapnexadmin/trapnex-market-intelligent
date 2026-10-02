import type { InstitutionalFlowRecord } from "./types";

const NSE_URL = "https://www.nseindia.com/api/fiidiiTradeReact";

function headers() {
  return {
    accept: "application/json,text/plain,*/*",
    "user-agent": "Mozilla/5.0",
    referer: "https://www.nseindia.com/",
  };
}

export async function getNseInstitutionalFlow(symbol?: string): Promise<InstitutionalFlowRecord | null> {
  if (process.env.NSE_INSTITUTIONAL_API_ENABLED !== "true") return null;

  const response = await fetch(NSE_URL, { headers: headers(), cache: "no-store" });
  if (!response.ok) throw new Error(`NSE_FII_DII_${response.status}`);

  const data = await response.json();
  const rows = Array.isArray(data) ? data : [];
  const target = symbol?.toUpperCase();
  const row = target
    ? rows.find((item: any) => String(item.symbol ?? "").toUpperCase() === target)
    : rows.at(-1);

  if (!row) return null;

  return {
    symbol: target ?? "MARKET",
    asOf: new Date().toISOString(),
    source: "NSE",
    snapshot: {
      fiiNet: Number.isFinite(Number(row.fiiNet)) ? Number(row.fiiNet) : null,
      diiNet: Number.isFinite(Number(row.diiNet)) ? Number(row.diiNet) : null,
      deliveryRatio: Number.isFinite(Number(row.deliveryRatio)) ? Number(row.deliveryRatio) : null,
      institutionalOwnershipChange: Number.isFinite(Number(row.institutionalOwnershipChange))
        ? Number(row.institutionalOwnershipChange)
        : null,
    },
    raw: row,
  };
}
