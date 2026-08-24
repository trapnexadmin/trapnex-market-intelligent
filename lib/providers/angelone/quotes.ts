import { angelRequest } from "./auth";
import type { AngelLtpResponse } from "./types";
import type { MarketQuote } from "@/lib/domain/market";

function toNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function getLtpData(input: {
  exchange: "NSE" | "BSE";
  tradingsymbol: string;
  symboltoken: string;
}): Promise<MarketQuote> {
  const data = await angelRequest<AngelLtpResponse>(
    "/rest/secure/angelbroking/order/v1/getLtpData",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  const price = toNumber(data.ltp);

  if (price === null) {
    throw new Error(`Angel One returned no LTP for ${input.tradingsymbol}`);
  }

  return {
    symbol: data.tradingsymbol,
    exchange: input.exchange,
    instrumentToken: data.symboltoken,
    instrumentType: "EQUITY",
    price,
    previousClose: toNumber(data.close),
    open: toNumber(data.open),
    high: toNumber(data.high),
    low: toNumber(data.low),
    volume: null,
    timestamp: new Date().toISOString(),
    provider: "Angel One SmartAPI",
  };
}
