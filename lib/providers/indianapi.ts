import type { MarketSnapshot } from '@/lib/intelligence/types';
import type { MarketDataProvider, ProviderHealth } from './provider';

const baseUrl = process.env.INDIANAPI_BASE_URL || 'https://stock.indianapi.in';

async function request(path: string, params?: Record<string, string>) {
  const url = new URL(path, baseUrl);
  Object.entries(params ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url, {
    headers: { 'x-api-key': process.env.INDIANAPI_API_KEY || '' },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`IndianAPI ${response.status}`);
  return response.json();
}

export class IndianApiProvider implements MarketDataProvider {
  readonly name = 'IndianAPI';

  async health(): Promise<ProviderHealth> {
    const checkedAt = new Date().toISOString();
    if (!process.env.INDIANAPI_API_KEY) return { provider: this.name, status: 'NOT_CONFIGURED', message: 'INDIANAPI_API_KEY is missing', checkedAt };
    const started = Date.now();
    try {
      await request('/trending');
      return { provider: this.name, status: 'READY', latencyMs: Date.now() - started, checkedAt };
    } catch (error) {
      return { provider: this.name, status: 'ERROR', latencyMs: Date.now() - started, message: error instanceof Error ? error.message : 'Unknown provider error', checkedAt };
    }
  }

  async getSnapshots(symbols: string[]): Promise<MarketSnapshot[]> {
    if (!process.env.INDIANAPI_API_KEY) return [];
    const requested = new Set(symbols.map((s) => s.toUpperCase()));
    const data = await request('/trending');
    const rows = [
      ...(data?.trending_stocks?.top_gainers ?? []),
      ...(data?.trending_stocks?.top_losers ?? []),
    ];
    return rows
      .filter((row: any) => !requested.size || requested.has(String(row.ticker_id).toUpperCase()))
      .map((row: any): MarketSnapshot => {
        const rawExchange = String(row.exchange_type ?? 'NSE').toUpperCase();
        const exchange: 'NSE' | 'BSE' = rawExchange.includes('BSE') ? 'BSE' : 'NSE';
        return {
          symbol: String(row.ticker_id),
          exchange,
          price: Number(row.price),
          previousClose: Number(row.close),
          open: Number(row.open),
          high: Number(row.high),
          low: Number(row.low),
          volume: Number(row.volume),
          timestamp: new Date(`${row.date ?? ''} ${row.time ?? ''}`).toISOString(),
        };
      })
      .filter((row: MarketSnapshot) => Number.isFinite(row.price));
  }
}
