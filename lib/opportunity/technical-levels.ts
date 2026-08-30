export interface CandleLike {
  high: number;
  low: number;
  close: number;
}

export function deriveTechnicalLevels(candles: CandleLike[]) {
  const valid = candles.filter(
    (c) =>
      Number.isFinite(c.high) &&
      Number.isFinite(c.low) &&
      Number.isFinite(c.close),
  );

  if (valid.length < 20) {
    return {
      entry: null,
      stopLoss: null,
      target: null,
      support: null,
      resistance: null,
    };
  }

  const recent = valid.slice(-20);
  const support = Math.min(...recent.map((c) => c.low));
  const resistance = Math.max(...recent.map((c) => c.high));
  const current = recent.at(-1)!.close;

  // Conservative breakout setup:
  // entry above resistance, protective stop under support.
  const entry = resistance > current ? resistance : current;
  const risk = entry - support;

  if (risk <= 0) {
    return { entry: null, stopLoss: null, target: null, support, resistance };
  }

  const stopLoss = support;
  const target = entry + risk * 2;

  return { entry, stopLoss, target, support, resistance };
}
