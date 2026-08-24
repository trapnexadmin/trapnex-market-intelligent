import { AngelOneProvider } from './angelone';
import { IndianApiProvider } from './indianapi';
import type { MarketDataProvider } from './provider';

export const providers: MarketDataProvider[] = [new IndianApiProvider(), new AngelOneProvider()];

export async function providerHealth() {
  return Promise.all(providers.map((provider) => provider.health()));
}

export async function getMarketSnapshots(symbols: string[]) {
  for (const provider of providers) {
    try {
      const rows = await provider.getSnapshots(symbols);
      if (rows.length) return { provider: provider.name, rows };
    } catch {
      // Continue to the next provider. The health endpoint exposes the actual failure state.
    }
  }
  return { provider: null, rows: [] };
}
