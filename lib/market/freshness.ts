import type { DataQuality, DataQualityState } from "@/lib/domain/quality";

export function getDataQuality(timestamp: string | null | undefined, provider: string | null): DataQualityState {
  if (!timestamp || !provider) {
    return { quality: "UNAVAILABLE", ageSeconds: null, provider: null, fallbackUsed: false, errors: [] };
  }
  const ageSeconds = Math.max(0, Math.round((Date.now() - new Date(timestamp).getTime()) / 1000));
  const quality: DataQuality =
    ageSeconds <= 15 ? "LIVE" :
    ageSeconds <= 120 ? "RECENT" :
    ageSeconds <= 900 ? "STALE" : "DEGRADED";
  return { quality, ageSeconds, provider, fallbackUsed: false, errors: [] };
}
