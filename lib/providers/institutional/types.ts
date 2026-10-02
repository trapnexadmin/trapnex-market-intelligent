export interface InstitutionalFlowSnapshot {
  fiiNet: number | null;
  diiNet: number | null;
  deliveryRatio: number | null;
  institutionalOwnershipChange: number | null;
}

export interface InstitutionalFlowRecord {
  symbol: string;
  asOf: string;
  source: string;
  snapshot: InstitutionalFlowSnapshot;
  raw?: unknown;
}

export interface InstitutionalFlowProvider {
  readonly name: string;
  readonly priority: number;
  health(): Promise<{ provider: string; status: "READY" | "NOT_CONFIGURED" | "ERROR"; message?: string }>;
  getFlow(symbol?: string): Promise<InstitutionalFlowRecord | null>;
}
