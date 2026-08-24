export type ProviderStatus = "READY" | "DEGRADED" | "NOT_CONFIGURED" | "ERROR";
export type ProviderCapability =
  | "quotes" | "candles" | "indices" | "breadth"
  | "fundamentals" | "news" | "corporate_actions";

export interface ProviderHealth {
  provider: string;
  status: ProviderStatus;
  latencyMs: number | null;
  capabilities: ProviderCapability[];
  lastSuccessfulAt: string | null;
  message?: string;
  checkedAt: string;
}
