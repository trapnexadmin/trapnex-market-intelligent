import type { Opportunity } from "./types";
import type { StockIntelligenceScore } from "@/lib/stock-intelligence/types";

export interface PipelineValidation {
  valid: boolean;
  issues: string[];
}

export function validatePipeline(
  stock: StockIntelligenceScore | null,
  opportunity: Opportunity | null,
  context: {
    marketPulse: number | null;
    sectorPulse: number | null;
    entry: number | null;
    target: number | null;
    stopLoss: number | null;
  },
): PipelineValidation {
  const issues: string[] = [];

  if (!stock || stock.score === null) issues.push("STOCK_INTELLIGENCE_SCORE_MISSING");
  if (!opportunity || opportunity.score === null) issues.push("OPPORTUNITY_SCORE_MISSING");
  if (context.marketPulse === null) issues.push("MARKET_PULSE_MISSING");
  if (context.sectorPulse === null) issues.push("SECTOR_PULSE_MISSING");
  if (context.entry === null) issues.push("ENTRY_MISSING");
  if (context.target === null) issues.push("TARGET_MISSING");
  if (context.stopLoss === null) issues.push("STOP_LOSS_MISSING");

  return { valid: issues.length === 0, issues };
}
