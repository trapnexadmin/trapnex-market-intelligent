export interface PriceLevelsInput {
  entry: number | null;
  stopLoss: number | null;
  target: number | null;
}

export interface PriceLevels {
  entry: number | null;
  stopLoss: number | null;
  target: number | null;
  upsidePct: number | null;
  downsidePct: number | null;
  riskReward: number | null;
  valid: boolean;
}

export function calculatePriceLevels(input: PriceLevelsInput): PriceLevels {
  const { entry, stopLoss, target } = input;

  if (
    entry === null || stopLoss === null || target === null ||
    !Number.isFinite(entry) || !Number.isFinite(stopLoss) ||
    !Number.isFinite(target) || entry <= 0
  ) {
    return {
      entry, stopLoss, target,
      upsidePct: null, downsidePct: null,
      riskReward: null, valid: false,
    };
  }

  const upsidePct = ((target - entry) / entry) * 100;
  const downsidePct = ((entry - stopLoss) / entry) * 100;
  const riskReward = downsidePct > 0 ? upsidePct / downsidePct : null;

  return {
    entry,
    stopLoss,
    target,
    upsidePct,
    downsidePct,
    riskReward,
    valid:
      stopLoss < entry &&
      target > entry &&
      upsidePct > 0 &&
      downsidePct > 0,
  };
}
