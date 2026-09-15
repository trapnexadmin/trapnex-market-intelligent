export interface UniverseClassification {
  symbol: string;
  capBucket: "LARGE" | "MID" | "SMALL" | null;
  sector: string | null;
}

export interface UniverseDataAvailability {
  symbol: string;
  classification: boolean;
  market: boolean;
  stockIntelligence: boolean;
  opportunityContext: boolean;
  completenessPct: number;
  eligible: boolean;
  missing: string[];
}

export function calculateCompleteness(input: {
  classification: boolean;
  market: boolean;
  stockIntelligence: boolean;
  opportunityContext: boolean;
}) {
  const checks = Object.values(input);
  const complete = checks.filter(Boolean).length;
  return Math.round((complete / checks.length) * 100);
}

export function assessUniverseRow(input: {
  symbol: string;
  classification: boolean;
  market: boolean;
  stockIntelligence: boolean;
  opportunityContext: boolean;
}): UniverseDataAvailability {
  const missing: string[] = [];
  if (!input.classification) missing.push("CLASSIFICATION");
  if (!input.market) missing.push("MARKET_DATA");
  if (!input.stockIntelligence) missing.push("STOCK_INTELLIGENCE");
  if (!input.opportunityContext) missing.push("OPPORTUNITY_CONTEXT");

  const completenessPct = calculateCompleteness(input);

  return {
    symbol: input.symbol.toUpperCase(),
    classification: input.classification,
    market: input.market,
    stockIntelligence: input.stockIntelligence,
    opportunityContext: input.opportunityContext,
    completenessPct,
    eligible: missing.length === 0,
    missing,
  };
}
