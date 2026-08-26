import { angelRequest } from "./auth";

export interface AngelCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
}

const n = (v: unknown) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : null;
};

export async function getHistoricalCandles(input: {
  exchange: string;
  symboltoken: string;
  interval: string;
  fromDate: string;
  toDate: string;
}) {
  const data = await angelRequest<any>(
    "/rest/secure/angelbroking/historical/v1/getCandleData",
    {
      method: "POST",
      body: JSON.stringify({
        exchange: input.exchange,
        symboltoken: input.symboltoken,
        interval: input.interval,
        fromdate: input.fromDate,
        todate: input.toDate,
      }),
    },
  );

  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  return rows
    .map((row: any) => {
      const [timestamp, open, high, low, close, volume] = row;
      return {
        timestamp: new Date(timestamp).toISOString(),
        open: n(open) ?? 0,
        high: n(high) ?? 0,
        low: n(low) ?? 0,
        close: n(close) ?? 0,
        volume: n(volume),
      };
    })
    .filter((row: AngelCandle) => row.close > 0);
}
