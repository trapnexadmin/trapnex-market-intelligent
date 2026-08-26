import { NextRequest, NextResponse } from "next/server";
import { findInstrument } from "@/lib/providers/angelone/instrument-master";
import { getHistoricalCandles } from "@/lib/providers/angelone/historical";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function datePart(value: string | null, fallback: Date) {
  if (!value) return fallback.toISOString().slice(0, 10) + " 15:30";
  return value.includes(" ") ? value : `${value} 15:30`;
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();
  if (!symbol) {
    return NextResponse.json(
      { status: "INVALID_REQUEST", message: "symbol is required" },
      { status: 400 },
    );
  }

  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 120);

  try {
    const target = symbol.endsWith("-EQ") ? symbol : `${symbol}-EQ`;
    const instrument =
      (await findInstrument({ symbol: target, exchangeSegment: "nse_cm" })) ??
      (await findInstrument({ symbol: target, exchangeSegment: "bse_cm" }));

    if (!instrument) {
      return NextResponse.json(
        { status: "NOT_FOUND", symbol, candles: [] },
        { status: 404 },
      );
    }

    const candles = await getHistoricalCandles({
      exchange: instrument.exch_seg === "bse_cm" ? "BSE" : "NSE",
      symboltoken: instrument.token,
      interval: "ONE_DAY",
      fromDate: datePart(request.nextUrl.searchParams.get("from"), from),
      toDate: datePart(request.nextUrl.searchParams.get("to"), to),
    });

    return NextResponse.json({
      status: candles.length ? "LIVE" : "INSUFFICIENT_DATA",
      symbol,
      provider: "Angel One SmartAPI",
      candles,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "UNAVAILABLE",
      symbol,
      candles: [],
      message: error instanceof Error ? error.message : "Historical candles unavailable",
      checkedAt: new Date().toISOString(),
    }, { status: 503 });
  }
}
