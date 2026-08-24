import { NextRequest, NextResponse } from "next/server";
import { findInstrument } from "@/lib/providers/angelone/instrument-master";
import { getLtpData } from "@/lib/providers/angelone/quotes";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim();
  const exchange = (request.nextUrl.searchParams.get("exchange") || "NSE").toUpperCase() as "NSE" | "BSE";

  if (!symbol) {
    return NextResponse.json({ status: "INVALID_REQUEST", message: "symbol is required" }, { status: 400 });
  }

  try {
    const instrument = await findInstrument({
      symbol: symbol.includes("-") ? symbol : `${symbol}-EQ`,
      exchangeSegment: exchange === "NSE" ? "nse_cm" : "bse_cm",
    });

    if (!instrument) {
      return NextResponse.json({
        status: "NOT_FOUND",
        message: `Instrument not found: ${symbol}`,
      }, { status: 404 });
    }

    const quote = await getLtpData({
      exchange,
      tradingsymbol: instrument.symbol,
      symboltoken: instrument.token,
    });

    return NextResponse.json({
      status: "LIVE",
      quote,
      instrument,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "UNAVAILABLE",
      message: error instanceof Error ? error.message : "Angel One quote failed",
    }, { status: 503 });
  }
}
