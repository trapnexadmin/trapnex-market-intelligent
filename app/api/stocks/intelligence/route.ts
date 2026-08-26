import { NextRequest, NextResponse } from "next/server";
import { findInstrument } from "@/lib/providers/angelone/instrument-master";
import { getLtpData } from "@/lib/providers/angelone/quotes";
import { getHistoricalCandles } from "@/lib/providers/angelone/historical";
import { calculateStockIntelligenceScore } from "@/lib/stock-intelligence/calculate";
import { calculateFundamentalQuality } from "@/lib/stock-intelligence/factors/fundamental";
import { calculateValuation } from "@/lib/stock-intelligence/factors/valuation";
import { calculateInstitutionalFlow } from "@/lib/stock-intelligence/factors/institutional";
import { calculateTechnicalStructure } from "@/lib/stock-intelligence/factors/technical";
import { getFundamentalValuationInputs } from "@/lib/stock-intelligence/integration/provider-factors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("symbol")?.trim();
  if (!raw) {
    return NextResponse.json({ status: "INVALID_REQUEST", message: "symbol is required" }, { status: 400 });
  }

  const symbol = raw.toUpperCase();
  const target = symbol.endsWith("-EQ") ? symbol : `${symbol}-EQ`;

  try {
    const instrument =
      (await findInstrument({ symbol: target, exchangeSegment: "nse_cm" })) ??
      (await findInstrument({ symbol: target, exchangeSegment: "bse_cm" }));

    let quote = null;
    let candles: any[] = [];
    if (instrument) {
      try {
        quote = await getLtpData({
          exchange: instrument.exch_seg === "bse_cm" ? "BSE" : "NSE",
          tradingsymbol: instrument.symbol,
          symboltoken: instrument.token,
        });
      } catch {}

      try {
        const to = new Date();
        const from = new Date(to);
        from.setDate(from.getDate() - 120);

        candles = await getHistoricalCandles({
          exchange: instrument.exch_seg === "bse_cm" ? "BSE" : "NSE",
          symboltoken: instrument.token,
          interval: "ONE_DAY",
          fromDate: `${from.toISOString().slice(0, 10)} 09:15`,
          toDate: `${to.toISOString().slice(0, 10)} 15:30`,
        });
      } catch {}
    }

    const providerInputs = await getFundamentalValuationInputs(symbol);
    const fundamentalQuality = calculateFundamentalQuality(providerInputs.fundamentals);
    const valuation = calculateValuation(providerInputs.valuation);
    const technicalStructure = calculateTechnicalStructure(candles);
    const institutionalFlow = calculateInstitutionalFlow({
      fiiNet: null,
      diiNet: null,
      deliveryRatio: null,
      institutionalOwnershipChange: null,
    });

    const intelligence = calculateStockIntelligenceScore({
      symbol,
      fundamentalQuality,
      technicalStructure,
      valuation,
      institutionalFlow,
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
        technical: technicalStructure !== null,
        fundamentals: fundamentalQuality !== null,
        valuation: valuation !== null,
        institutionalFlow: institutionalFlow !== null,
        sectorAlignment: false,
        newsEvent: false,
        riskTrapShield: false,
      },
      data: {
        candleCount: candles.length,
        providerFundamentalErrors: providerInputs.errors,
      },
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
