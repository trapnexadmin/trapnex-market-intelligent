import { getMarketSnapshots } from "@/lib/providers/registry";
import { getClassification, listClassifications } from "@/lib/classification/registry";
import { ensureClassificationsLoaded } from "@/lib/classification/bootstrap";
import { calculateUnifiedPulses } from "@/lib/market-pulse/unified";

export interface UnifiedMarketContext {
  status: "READY" | "INSUFFICIENT_DATA";
  marketPulse: number | null;
  capPulse: number | null;
  sectorPulse: number | null;
  classification: {
    capBucket: "LARGE" | "MID" | "SMALL" | null;
    sector: string | null;
  };
  provenance: {
    provider: string | null;
    classificationCount: number;
    calculatedAt: string;
  };
  errors: string[];
}

export interface UnifiedMarketPulseContext {
  status: "READY" | "INSUFFICIENT_DATA";
  marketPulse: number | null;
  capPulses: Record<"LARGE" | "MID" | "SMALL", number | null>;
  sectorPulses: Record<string, number | null>;
  provider: string | null;
  classificationCount: number;
  calculatedAt: string;
  errors: string[];
}

export async function buildUnifiedMarketPulseContext(): Promise<UnifiedMarketPulseContext> {
  const [market, classifications] = await Promise.all([
    getMarketSnapshots([]),
    ensureClassificationsLoaded(),
  ]);

  if (!market.rows.length || !classifications.length) {
    return {
      status: "INSUFFICIENT_DATA",
      marketPulse: null,
      capPulses: { LARGE: null, MID: null, SMALL: null },
      sectorPulses: {},
      provider: market.provider ?? null,
      classificationCount: classifications.length,
      calculatedAt: new Date().toISOString(),
      errors: [
        ...market.errors,
        !classifications.length ? "CLASSIFICATION_UNAVAILABLE" : "",
      ].filter(Boolean),
    };
  }

  const unified = calculateUnifiedPulses(market.rows, classifications);

  const capPulses = {
    LARGE: unified.capPulses.LARGE?.score ?? null,
    MID: unified.capPulses.MID?.score ?? null,
    SMALL: unified.capPulses.SMALL?.score ?? null,
  };

  const sectorPulses: Record<string, number | null> = {};
  for (const [sector, pulse] of Object.entries(unified.sectorPulses)) {
    sectorPulses[sector.toUpperCase()] = pulse?.score ?? null;
  }

  const marketPulse = unified.nifty.score;
  const errors = [...market.errors];

  if (marketPulse === null) errors.push("MARKET_PULSE_UNAVAILABLE");
  if (capPulses.LARGE === null) errors.push("LARGE_CAP_PULSE_UNAVAILABLE");
  if (capPulses.MID === null) errors.push("MID_CAP_PULSE_UNAVAILABLE");
  if (capPulses.SMALL === null) errors.push("SMALL_CAP_PULSE_UNAVAILABLE");

  return {
    status:
      marketPulse !== null &&
      Object.values(capPulses).every((value) => value !== null)
        ? "READY"
        : "INSUFFICIENT_DATA",
    marketPulse,
    capPulses,
    sectorPulses,
    provider: market.provider ?? null,
    classificationCount: classifications.length,
    calculatedAt: new Date().toISOString(),
    errors,
  };
}

export async function getUnifiedMarketContext(
  symbol: string,
  context?: UnifiedMarketPulseContext,
): Promise<UnifiedMarketContext> {
  const pulseContext = context ?? await buildUnifiedMarketPulseContext();
  await ensureClassificationsLoaded();
  const classification = getClassification(symbol);

  if (!classification || pulseContext.status === "INSUFFICIENT_DATA") {
    return {
      status: "INSUFFICIENT_DATA",
      marketPulse: pulseContext.marketPulse,
      capPulse: classification?.capBucket
        ? pulseContext.capPulses[classification.capBucket]
        : null,
      sectorPulse: classification?.sector
        ? pulseContext.sectorPulses[classification.sector.toUpperCase()] ?? null
        : null,
      classification: {
        capBucket: classification?.capBucket ?? null,
        sector: classification?.sector ?? null,
      },
      provenance: {
        provider: pulseContext.provider,
        classificationCount: pulseContext.classificationCount,
        calculatedAt: pulseContext.calculatedAt,
      },
      errors: [
        ...pulseContext.errors,
        !classification ? "SYMBOL_CLASSIFICATION_UNAVAILABLE" : "",
      ].filter(Boolean),
    };
  }

  const capPulse = classification.capBucket
    ? pulseContext.capPulses[classification.capBucket]
    : null;
  const sectorPulse = classification.sector
    ? pulseContext.sectorPulses[classification.sector.toUpperCase()] ?? null
    : null;

  const errors = [...pulseContext.errors];
  if (capPulse === null) errors.push("CAP_PULSE_UNAVAILABLE");
  if (sectorPulse === null) errors.push("SECTOR_PULSE_UNAVAILABLE");

  return {
    status:
      pulseContext.marketPulse !== null &&
      capPulse !== null &&
      sectorPulse !== null
        ? "READY"
        : "INSUFFICIENT_DATA",
    marketPulse: pulseContext.marketPulse,
    capPulse,
    sectorPulse,
    classification: {
      capBucket: classification.capBucket,
      sector: classification.sector,
    },
    provenance: {
      provider: pulseContext.provider,
      classificationCount: pulseContext.classificationCount,
      calculatedAt: pulseContext.calculatedAt,
    },
    errors,
  };
}
