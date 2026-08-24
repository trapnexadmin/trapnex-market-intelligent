import type { Candle } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

function sma(values: number[], period: number): number | null {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function rsi(closes: number[], period = 14): number | null {
  if (closes.length <= period) return null;
  let gain = 0;
  let loss = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) gain += change;
    else loss += Math.abs(change);
  }

  if (loss === 0) return 100;
  const rs = gain / loss;
  return 100 - 100 / (1 + rs);
}

export function calculateTechnicalStructure(candles: Candle[]): number | null {
  const valid = candles
    .filter(
      (c) =>
        Number.isFinite(c.close) &&
        Number.isFinite(c.high) &&
        Number.isFinite(c.low),
    )
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (valid.length < 50) return null;

  const closes = valid.map((c) => c.close);
  const current = closes.at(-1) as number;
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const currentRsi = rsi(closes);

  if (sma20 === null || sma50 === null || currentRsi === null) return null;

  let score = 50;

  if (current > sma20) score += 12;
  else score -= 12;

  if (sma20 > sma50) score += 15;
  else score -= 15;

  if (currentRsi >= 55 && currentRsi <= 70) score += 12;
  else if (currentRsi < 35 || currentRsi > 80) score -= 8;

  const recent = valid.slice(-20);
  const volumeRows = recent.filter((c) => c.volume !== null);
  if (volumeRows.length >= 10) {
    const avgVolume =
      volumeRows.reduce((sum, c) => sum + (c.volume as number), 0) /
      volumeRows.length;
    const lastVolume = volumeRows.at(-1)?.volume ?? 0;
    if (lastVolume >= avgVolume) score += 8;
  }

  return Math.round(clamp(score) * 10) / 10;
}
