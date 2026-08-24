export type DataQuality = "LIVE" | "RECENT" | "STALE" | "DEGRADED" | "UNAVAILABLE";

export interface DataQualityState {
  quality: DataQuality;
  ageSeconds: number | null;
  provider: string | null;
  fallbackUsed: boolean;
  errors: string[];
}
