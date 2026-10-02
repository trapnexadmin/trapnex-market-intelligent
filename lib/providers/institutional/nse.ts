import type { InstitutionalFlowRecord } from "./types";

const NSE_URL = "https://www.nseindia.com/api/fiidiiTradeReact";

function headers() {
  return {
    accept: "application/json,text/plain,*/*",
    "user-agent": "Mozilla/5.0",
    referer: "https://www.nseindia.com/",
  };
}

function finite(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function field(row: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    if (name in row) return finite(row[name]);
  }
  return null;
}

export async function getNseInstitutionalFlow(
  symbol?: string,
): Promise<InstitutionalFlowRecord | null> {
  if (process.env.NSE_INSTITUTIONAL_API_ENABLED !== "true") return null;

  const response = await fetch(NSE_URL, {
    headers: headers(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`NSE_FII_DII_${response.status}`);
  }

  const data = await response.json();
  const rows = Array.isArray(data)
    ? data.filter((row): row is Record<string, unknown> =>
        Boolean(row && typeof row === "object"),
      )
    : [];

  const target = symbol?.toUpperCase();
  const row = target
    ? rows.find(
        (item) =>
          String(item.symbol ?? item.Symbol ?? "").toUpperCase() === target,
      )
    : rows.at(-1);

  if (!row) return null;

  const snapshot = {
    fiiNet: field(row, ["fiiNet", "FII_Net", "fii_net"]),
    diiNet: field(row, ["diiNet", "DII_Net", "dii_net"]),
    deliveryRatio: field(row, [
      "deliveryRatio",
      "Delivery_Ratio",
      "delivery_ratio",
    ]),
    institutionalOwnershipChange: field(row, [
      "institutionalOwnershipChange",
      "Institutional_Ownership_Change",
      "institutional_ownership_change",
    ]),
  };

  const hasKnownField = Object.values(snapshot).some(
    (value) => value !== null,
  );

  // Do not label an endpoint response as usable institutional data unless
  // at least one expected field was actually mapped.
  if (!hasKnownField) return null;

  return {
    symbol: target ?? "MARKET",
    asOf: new Date().toISOString(),
    source: "NSE",
    snapshot,
    raw: row,
  };
}
