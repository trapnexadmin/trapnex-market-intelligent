import type { MarketSnapshot } from '@/lib/intelligence/types';

export type ProviderStatus = 'READY' | 'DEGRADED' | 'NOT_CONFIGURED' | 'ERROR';

export interface ProviderHealth {
  provider: string;
  status: ProviderStatus;
  latencyMs?: number;
  message?: string;
  checkedAt: string;
}

export interface MarketDataProvider {
  readonly name: string;
  health(): Promise<ProviderHealth>;
  getSnapshots(symbols: string[]): Promise<MarketSnapshot[]>;
}
