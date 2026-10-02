import type { HistoricalCandleQuery } from "../types";

const API = "https://apiconnect.angelone.in";
const MAX_DAYS_ONE_DAY = 2000;
const MAX_DAYS_ONE_HOUR = 400;
const MAX_DAYS_FIFTEEN_MINUTE = 200;
const MAX_DAYS_FIVE_MINUTE = 100;
const MAX_DAYS_ONE_MINUTE = 30;

function maxDays(interval: HistoricalCandleQuery["interval"]) {
  switch (interval) {
    case "ONE_DAY": return MAX_DAYS_ONE_DAY;
    case "ONE_HOUR": return MAX_DAYS_ONE_HOUR;
    case "FIFTEEN_MINUTE": return MAX_DAYS_FIFTEEN_MINUTE;
    case "FIVE_MINUTE": return MAX_DAYS_FIVE_MINUTE;
    default: return MAX_DAYS_ONE_MINUTE;
  }
}

export async function fetchAngelHistoricalCandles(
  token: string,
  exchange: "NSE" | "BSE",
  interval: HistoricalCandleQuery["interval"],
  from: string,
  to: string,
  jwtToken: string,
) {
  const start = new Date(from);
  const end = new Date(to);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    throw new Error("HISTORICAL_RANGE_INVALID");
  }

  const limitMs = maxDays(interval) * 24 * 60 * 60 * 1000;
  const rows: { timestamp: string; open: number; high: number; low: number; close: number; volume: number | null }[] = [];

  for (let cursor = start.getTime(); cursor < end.getTime();) {
    const chunkEnd = Math.min(cursor + limitMs, end.getTime());
    const payload = {
      exchange,
      symboltoken: token,
      interval,
      fromdate: new Date(cursor).toISOString().slice(0, 16).replace("T", " "),
      todate: new Date(chunkEnd).toISOString().slice(0, 16).replace("T", " "),
    };
    const response = await fetch(`${API}/rest/secure/angelbroking/historical/v1/getCandleData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-UserType": "USER",
        "X-SourceID": "WEB",
        "X-ClientLocalIP": process.env.ANGEL_ONE_CLIENT_LOCAL_IP || "127.0.0.1",
        "X-ClientPublicIP": process.env.ANGEL_ONE_CLIENT_PUBLIC_IP || "",
        "X-MACAddress": process.env.ANGEL_ONE_MAC_ADDRESS || "00:00:00:00:00:00",
        "X-PrivateKey": process.env.ANGEL_ONE_API_KEY || "",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok || !data?.status) throw new Error(data?.message || `ANGEL_HISTORICAL_${response.status}`);

    for (const row of Array.isArray(data.data) ? data.data : []) {
      if (!Array.isArray(row) || row.length < 6) continue;
      const [timestamp, open, high, low, close, volume] = row;
      if ([open, high, low, close].every((v) => Number.isFinite(Number(v)))) {
        rows.push({
          timestamp: new Date(String(timestamp)).toISOString(),
          open: Number(open),
          high: Number(high),
          low: Number(low),
          close: Number(close),
          volume: Number.isFinite(Number(volume)) ? Number(volume) : null,
        });
      }
    }

    if (chunkEnd <= cursor) break;
    cursor = chunkEnd;
  }

  const seen = new Set<string>();
  return rows.filter((row) => {
    if (seen.has(row.timestamp)) return false;
    seen.add(row.timestamp);
    return true;
  }).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
