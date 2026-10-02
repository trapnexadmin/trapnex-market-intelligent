import type { Candle } from "@/lib/stock-intelligence/factors/types";

export type LiquidityAssessment = {
  score: number | null;
  averageTurnover: number | null;
  observations: number;
  windowSessions: number;
  source: "historical_candle_turnover" | null;
  reason:
    | "INSUFFICIENT_CANDLE_HISTORY"
    | "INSUFFICIENT_VOLUME_DATA"
    | "INVALID_THRESHOLDS"
    | null;
};

export function assessLiquidity(
  candles: Candle[],
  currentPrice: number | null,
): LiquidityAssessment {
  const window = candles.slice(-20);

  if (!currentPrice || currentPrice <= 0) {
    return {
      score: null,
      averageTurnover: null,
      observations: 0,
      windowSessions: window.length,
      source: null,
      reason:
        candles.length < 5
          ? "INSUFFICIENT_CANDLE_HISTORY"
          : "INSUFFICIENT_VOLUME_DATA",
    };
  }

  const turnover = window
    .map((candle) =>
      candle.volume !== null &&
      candle.volume >= 0 &&
      Number.isFinite(candle.close)
        ? candle.volume * candle.close
        : null,
    )
    .filter(
      (value): value is number =>
        value !== null && Number.isFinite(value),
    );

  if (turnover.length < 5) {
    return {
      score: null,
      averageTurnover: null,
      observations: turnover.length,
      windowSessions: window.length,
      source: null,
      reason:
        candles.length < 5
          ? "INSUFFICIENT_CANDLE_HISTORY"
          : "INSUFFICIENT_VOLUME_DATA",
    };
  }

  const average =
    turnover.reduce((sum, value) => sum + value, 0) /
    turnover.length;

  const floor = Number(
    process.env.LIQUIDITY_TURNOVER_FLOOR ?? 1e7,
  );
  const ceiling = Number(
    process.env.LIQUIDITY_TURNOVER_CEILING ?? 1e10,
  );

  if (
    !Number.isFinite(floor) ||
    !Number.isFinite(ceiling) ||
    floor <= 0 ||
    ceiling <= floor
  ) {
    return {
      score: null,
      averageTurnover: average,
      observations: turnover.length,
      windowSessions: window.length,
      source: "historical_candle_turnover",
      reason: "INVALID_THRESHOLDS",
    };
  }

  const ratio = Math.max(
    0,
    Math.min(
      1,
      (Math.log10(Math.max(average, floor)) -
        Math.log10(floor)) /
        (Math.log10(ceiling) - Math.log10(floor)),
    ),
  );

  return {
    score: Math.round(ratio * 1000) / 10,
    averageTurnover: Math.round(average * 100) / 100,
    observations: turnover.length,
    windowSessions: window.length,
    source: "historical_candle_turnover",
    reason: null,
  };
}

export function calculateLiquidityScore(
  candles: Candle[],
  currentPrice: number | null,
) {
  return assessLiquidity(candles, currentPrice).score;
}
