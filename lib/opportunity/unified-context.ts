import { getMarketSnapshots } from "@/lib/providers/registry";
import { getClassification } from "@/lib/classification/registry";
import { ensureClassificationsLoaded } from "@/lib/classification/bootstrap";
import { calculateUnifiedPulses } from "@/lib/market-pulse/unified";

export interface UnifiedMarketContext {
  status: "READY" | "INSUFFICIENT_DATA";
  marketPulse: number | null;
  sectorPulse: number | null;
  classification: {
    capBucket: "LARGE" | "MID" | "SMALL" | null;
    sector: string | null;
  };
  provenance: {
    provider: string;
    classificationCount: number;
    calculatedAt: string;
  };
  errors: string[];
}

export async function getUnifiedMarketContext(symbol: string): Promise<UnifiedMarketContext> {
  const market = await getMarketSnapshots([]);
  const classifications = await ensureClassificationsLoaded();
  const classification = getClassification(symbol);

  if (!market.rows.length || !classifications.length || !classification) {
    return {
      status: "INSUFFICIENT_DATA",
      marketPulse: null,
      sectorPulse: null,
      classification: {
        capBucket: classification?.capBucket ?? null,
        sector: classification?.sector ?? null,
      },
      provenance: {
        provider: market.provider,
        classificationCount: classifications.length,
        calculatedAt: new Date().toISOString(),
      },
      errors: [
        ...market.errors,
        !classifications.length ? "CLASSIFICATION_UNAVAILABLE" : "",
        !classification ? "SYMBOL_CLASSIFICATION_UNAVAILABLE" : "",
      ].filter(Boolean),
    };
  }

  const unified = calculateUnifiedPulses(market.rows, classifications);
  const marketPulse = unified.nifty.score;
  const capPulse = classification.capBucket
    ? (unified.capPulses as Record<string, { score: number | null }>)[classification.capBucket]?.score ?? null
    : null;
  const sectorPulse = classification.sector
    ? (unified.sectorPulses as Record<string, { score: number | null }>)[classification.sector.toUpperCase()]?.score ?? null
    : null;

  const errors = [...market.errors];
  if (capPulse === null) errors.push("CAP_PULSE_UNAVAILABLE");
  if (sectorPulse === null) errors.push("SECTOR_PULSE_UNAVAILABLE");

  return {
    status: marketPulse !== null && capPulse !== null && sectorPulse !== null
      ? "READY" : "INSUFFICIENT_DATA",
    marketPulse, sectorPulse,
    classification: {
      capBucket: classification.capBucket,
      sector: classification.sector,
    },
    provenance: {
      provider: market.provider,
      classificationCount: classifications.length,
      calculatedAt: new Date().toISOString(),
    },
    errors,
  };
}
