import { NextRequest, NextResponse } from "next/server";
import { findInstrument } from "@/lib/providers/angelone/instrument-master";
import { getLtpData } from "@/lib/providers/angelone/quotes";
import { calculateStockIntelligenceScore } from "@/lib/stock-intelligence/calculate";
import { calculateFundamentalQuality } from "@/lib/stock-intelligence/factors/fundamental";
import { calculateValuation } from "@/lib/stock-intelligence/factors/valuation";
import { calculateInstitutionalFlow } from "@/lib/stock-intelligence/factors/institutional";
import { calculateTechnicalStructure } from "@/lib/stock-intelligence/factors/technical";
import type { Candle } from "@/lib/stock-intelligence/factors/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function blankFactors() {
  return {
    fundamentalQuality: null,
    technicalStructure: null,
    valuation: null,
    institutionalFlow: null,
    sectorAlignment: null,
    newsEvent: null,
    riskTrapShield: null,
  };
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("symbol")?.trim();
  if (!raw) {
    return NextResponse.json(
      { status: "INVALID_REQUEST", message: "symbol is required" },
      { status: 400 },
    );
  }

  const symbol = raw.toUpperCase();
  const target = symbol.endsWith("-EQ") ? symbol : `${symbol}-EQ`;

  try {
    const instrument =
      (await findInstrument({ symbol: target, exchangeSegment: "nse_cm" })) ??
      (await findInstrument({ symbol: target, exchangeSegment: "bse_cm" }));

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

    // Real factor calculators are wired here, but remain null until actual
    // provider snapshots are supplied. No synthetic inputs are created.
    const fundamentals = calculateFundamentalQuality({
      revenueGrowth: null,
      earningsGrowth: null,
      roe: null,
      roce: null,
      debtToEquity: null,
      operatingCashFlow: null,
      freeCashFlow: null,
      profitMargin: null,
    });

    const valuation = calculateValuation({
      pe: null,
      pb: null,
      evEbitda: null,
      earningsGrowth: null,
      historicalPePercentile: null,
    });

    const institutionalFlow = calculateInstitutionalFlow({
      fiiNet: null,
      diiNet: null,
      deliveryRatio: null,
      institutionalOwnershipChange: null,
    });

    const candles: Candle[] = [];
    const technical = calculateTechnicalStructure(candles);

    const intelligence = calculateStockIntelligenceScore({
      symbol,
      ...blankFactors(),
      fundamentalQuality: fundamentals,
      technicalStructure: technical,
      valuation,
      institutionalFlow,
    });

    return NextResponse.json({
      status: intelligence.status,
      symbol,
      instrument,
      quote,
      intelligence,
      readiness: {
        liveQuote: Boolean(quote),
        technical: technical !== null,
        fundamentals: fundamentals !== null,
        valuation: valuation !== null,
        institutionalFlow: institutionalFlow !== null,
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
    return NextResponse.json(
      {
        status: "UNAVAILABLE",
        symbol,
        intelligence: null,
        message:
          error instanceof Error
            ? error.message
            : "Stock intelligence unavailable",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
