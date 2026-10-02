import type { Candle } from "@/lib/stock-intelligence/factors/types";

export function calculateLiquidityScore(
  candles: Candle[],
  currentPrice: number | null,
) {
  if (!currentPrice || currentPrice <= 0) return null;

  const turnover = candles
    .slice(-20)
    .map((candle) =>
      candle.volume !== null && candle.volume >= 0
        ? candle.volume * candle.close
        : null,
    )
    .filter((value): value is number => value !== null && Number.isFinite(value));

  if (turnover.length < 5) return null;

  const average = turnover.reduce((sum, value) => sum + value, 0) / turnover.length;

  // Log scale avoids allowing very large-cap names to dominate solely because
  // their rupee turnover is much larger. Thresholds are deliberately
  // configurable rather than pretending to be universal liquidity cutoffs.
  const floor = Number(process.env.LIQUIDITY_TURNOVER_FLOOR ?? 1e7);
  const ceiling = Number(process.env.LIQUIDITY_TURNOVER_CEILING ?? 1e10);
  if (!Number.isFinite(floor) || !Number.isFinite(ceiling) || ceiling <= floor) {
    return null;
  }

  const ratio = Math.max(
    0,
    Math.min(
      1,
      (Math.log10(Math.max(average, floor)) - Math.log10(floor)) /
        (Math.log10(ceiling) - Math.log10(floor)),
    ),
  );

  return Math.round(ratio * 1000) / 10;
}
