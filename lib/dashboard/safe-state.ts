export type LiveState = "LIVE" | "STALE" | "INSUFFICIENT_DATA" | "UNAVAILABLE";

export function displayNumber(value: number | null | undefined, suffix = "") {
  return value == null || !Number.isFinite(value) ? "—" : `${value}${suffix}`;
}
