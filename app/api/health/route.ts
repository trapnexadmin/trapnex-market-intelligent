import { NextResponse } from 'next/server';
import { providerHealth } from '@/lib/providers/registry';

export async function GET() {
  const providers = await providerHealth();
  const ready = providers.filter((p) => p.status === 'READY').length;
  return NextResponse.json({
    service: 'trapnex-market-intelligence',
    status: ready > 0 ? 'DEGRADED' : 'WAITING_FOR_DATA',
    providers,
    checkedAt: new Date().toISOString(),
  });
}
