import type { BreadthInputRow } from "./types";

/**
 * Phase 2D universe resolver contract.
 * The actual historical/DMA aggregation is intentionally provider-neutral.
 * It consumes normalized price/candle rows from the data layer.
 */
export interface BreadthUniverseProvider {
  getUniverseSnapshot(market: string): Promise<BreadthInputRow[]>;
}
