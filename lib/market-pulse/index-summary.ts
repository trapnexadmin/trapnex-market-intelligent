import type { TrendPulse } from "@/lib/intelligence/types";

export interface PulseSummary {
  nifty:TrendPulse;
  cap:Record<"LARGE"|"MID"|"SMALL",number|null>;
  sectors:Record<string,number|null>;
}

export function buildPulseSummary(
  nifty:TrendPulse,
  cap:Record<"LARGE"|"MID"|"SMALL",number|null>,
  sectors:Record<string,number|null>,
):PulseSummary{
  return {nifty,cap,sectors};
}
