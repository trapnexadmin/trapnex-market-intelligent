import { NextRequest, NextResponse } from "next/server";
import { findInstrument } from "@/lib/providers/angelone/instrument-master";
import { getLtpData } from "@/lib/providers/angelone/quotes";
import { buildStockIntelligence } from "@/lib/stock-intelligence/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function emptyInput(symbol: string) {
  return buildStockIntelligence({
    symbol,
    candles: [],
    fundamentals: {
      revenueGrowth: null,
      earningsGrowth: null,
      roe: null,
      roce: null,
      debtToEquity: null,
      operatingCashFlow: null,
      freeCashFlow: null,
      profitMargin: null,
    },
    valuation: {
      pe: null,
      pb: null,
      evEbitda: null,
      earningsGrowth: null,
      historicalPePercentile: null,
    },
    institutionalFlow: {
      fiiNet: null,
      diiNet: null,
      deliveryRatio: null,
      institutionalOwnershipChange: null,
    },
    sectorAlignment: null,
    newsEvent: null,
    riskTrapShield: null,
  });
}

export async function GET(request: NextRequest) {
  const rawSymbol = request.nextUrl.searchParams.get("symbol")?.trim();

  if (!rawSymbol) {
    return NextResponse.json(
      { status: "INVALID_REQUEST", message: "symbol is required" },
      { status: 400 },
    );
  }

  const symbol = rawSymbol.toUpperCase();
  const instrumentSymbol = symbol.endsWith("-EQ") ? symbol : `${symbol}-EQ`;

  try {
    const instrument =
      (await findInstrument({
        symbol: instrumentSymbol,
        exchangeSegment: "nse_cm",
      })) ??
      (await findInstrument({
        symbol: instrumentSymbol,
        exchangeSegment: "bse_cm",
      }));

    let quote = null;
    if (instrument) {
      try {
        quote = await getLtpData({
          exchange: instrument.exch_seg === "bse_cm" ? "BSE" : "NSE",
          tradingsymbol: instrument.symbol,
          symboltoken: instrument.token,
        });
      } catch {
        quote = null;
      }
    }

    const intelligence = buildStockIntelligence({
      ...emptyInput(symbol),
      candles: [],
      fundamentals: {
        revenueGrowth: null,
        earningsGrowth: null,
        roe: null,
        roce: null,
        debtToEquity: null,
        operatingCashFlow: null,
        freeCashFlow: null,
        profitMargin: null,
      },
      valuation: {
        pe: null,
        pb: null,
        evEbitda: null,
        earningsGrowth: null,
        historicalPePercentile: null,
      },
      institutionalFlow: {
        fiiNet: null,
        diiNet: null,
        deliveryRatio: null,
        institutionalOwnershipChange: null,
      },
      sectorAlignment: null,
      newsEvent: null,
      riskTrapShield: null,
    });

    return NextResponse.json({
      status: intelligence.status,
      symbol,
      instrument,
      quote,
      intelligence,
      readiness: {
        liveQuote: Boolean(quote),
        technical: false,
        fundamentals: false,
        valuation: false,
        institutionalFlow: false,
        sectorAlignment: false,
        newsEvent: false,
        riskTrapShield: false,
      },
      message: intelligence.status === "INSUFFICIENT_DATA"
        ? "Stock identity and live quote resolution are available where configured; intelligence factors are still awaiting their real data adapters."
        : undefined,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "UNAVAILABLE",
      symbol,
      intelligence: null,
      message: error instanceof Error ? error.message : "Stock intelligence unavailable",
      checkedAt: new Date().toISOString(),
    }, { status: 503 });
  }
}
