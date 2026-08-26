import { NextRequest, NextResponse } from "next/server";
import { findInstrument } from "@/lib/providers/angelone/instrument-master";
import { getLtpData } from "@/lib/providers/angelone/quotes";
import { calculateStockIntelligenceScore } from "@/lib/stock-intelligence/calculate";
import { calculateFundamentalQuality } from "@/lib/stock-intelligence/factors/fundamental";
import { calculateValuation } from "@/lib/stock-intelligence/factors/valuation";
import { calculateInstitutionalFlow } from "@/lib/stock-intelligence/factors/institutional";
import { calculateTechnicalStructure } from "@/lib/stock-intelligence/factors/technical";
import { getFundamentalValuationInputs } from "@/lib/stock-intelligence/integration/provider-factors";
import type { Candle } from "@/lib/stock-intelligence/factors/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("symbol")?.trim();
  if (!raw) return NextResponse.json({ status: "INVALID_REQUEST", message: "symbol is required" }, { status: 400 });

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
      } catch {}
    }

    const providerInputs = await getFundamentalValuationInputs(symbol);

    const fundamentalQuality = calculateFundamentalQuality(providerInputs.fundamentals);
    const valuation = calculateValuation(providerInputs.valuation);
    const institutionalFlow = calculateInstitutionalFlow({
      fiiNet: null,
      diiNet: null,
      deliveryRatio: null,
      institutionalOwnershipChange: null,
    });
    const technicalStructure = calculateTechnicalStructure([] as Candle[]);

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
      sources: {
        fundamentals: providerInputs.errors.length ? "DEGRADED" : "LIVE",
        technical: "PENDING",
        institutionalFlow: "PENDING",
        sectorAlignment: "PENDING",
        newsEvent: "PENDING",
        riskTrapShield: "PENDING",
      },
      providerErrors: providerInputs.errors,
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
