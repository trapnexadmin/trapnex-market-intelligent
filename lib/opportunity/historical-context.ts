import { findInstrument } from "@/lib/providers/angelone/instrument-master";
import { getHistoricalCandles } from "@/lib/providers/angelone/historical";
import { getLtpData } from "@/lib/providers/angelone/quotes";
import { buildTechnicalPlan } from "./technical-plan";

export interface HistoricalOpportunityContext {
  quote: {
    symbol: string;
    price: number;
    provider: string;
    asOf: string;
  } | null;
  candles: { high: number; low: number; close: number }[];
  entry: number | null;
  stopLoss: number | null;
  target: number | null;
  sources: string[];
  errors: string[];
}

function todayWithTime(date: Date, time: string) {
  return `${date.toISOString().slice(0, 10)} ${time}`;
}

export async function getAngelOneHistoricalContext(
  symbol: string,
): Promise<HistoricalOpportunityContext> {
  const errors: string[] = [];
  const sources: string[] = [];

  const targetSymbol = symbol.endsWith("-EQ") ? symbol : `${symbol}-EQ`;
  const instrument =
    (await findInstrument({
      symbol: targetSymbol,
      exchangeSegment: "nse_cm",
    })) ??
    (await findInstrument({
      symbol: targetSymbol,
      exchangeSegment: "bse_cm",
    }));

  if (!instrument) {
    return {
      quote: null,
      candles: [],
      entry: null,
      stopLoss: null,
      target: null,
      sources,
      errors: [`INSTRUMENT_NOT_FOUND:${symbol}`],
    };
  }

  const exchange = instrument.exch_seg === "bse_cm" ? "BSE" : "NSE";

  let quote: HistoricalOpportunityContext["quote"] = null;
  try {
    const ltp = await getLtpData({
      exchange,
      tradingsymbol: instrument.symbol,
      symboltoken: instrument.token,
    });

    if (ltp.price !== null && Number.isFinite(ltp.price) && ltp.price > 0) {
      quote = {
        symbol: ltp.symbol,
        price: ltp.price,
        provider: ltp.provider,
        asOf: ltp.timestamp,
      };
      sources.push(ltp.provider);
    } else {
      errors.push("ANGEL_ONE:INVALID_LTP");
    }
  } catch (error) {
    errors.push(
      `ANGEL_ONE_LTP:${error instanceof Error ? error.message : "UNKNOWN_ERROR"}`,
    );
  }

  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 180);

  let candles: HistoricalOpportunityContext["candles"] = [];
  try {
    candles = await getHistoricalCandles({
      exchange,
      symboltoken: instrument.token,
      interval: "ONE_DAY",
      fromDate: todayWithTime(from, "09:15"),
      toDate: todayWithTime(to, "15:30"),
    });
    if (candles.length) sources.push("Angel One SmartAPI:HISTORICAL");
    else errors.push("ANGEL_ONE:HISTORICAL_EMPTY");
  } catch (error) {
    errors.push(
      `ANGEL_ONE_HISTORICAL:${error instanceof Error ? error.message : "UNKNOWN_ERROR"}`,
    );
  }

  const plan = buildTechnicalPlan(candles);

  return {
    quote,
    candles,
    entry: plan.entry,
    stopLoss: plan.stopLoss,
    target: plan.target,
    sources,
    errors,
  };
}
