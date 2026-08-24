export type MarketDirection = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'INSUFFICIENT_DATA';

export interface MarketSnapshot {
  symbol: string;
  exchange: 'NSE' | 'BSE';
  price: number;
  previousClose?: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  timestamp: string;
}

export interface BreadthSnapshot {
  advancers: number;
  decliners: number;
  unchanged: number;
  total: number;
  above20dma?: number;
  above50dma?: number;
  above200dma?: number;
  timestamp: string;
}

export interface PulseFactor {
  key: string;
  label: string;
  score: number | null;
  weight: number;
  status: 'READY' | 'MISSING';
}

export interface TrendPulse {
  score: number | null;
  direction: MarketDirection;
  confidence: number;
  factors: PulseFactor[];
  calculatedAt: string;
  dataFreshnessSeconds: number | null;
  sourceCount: number;
}
