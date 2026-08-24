import { NextResponse } from 'next/server';
import { calculateTrendPulse } from '@/lib/intelligence/pulse';
import { getMarketSnapshots } from '@/lib/providers/registry';

export async function GET() {
  const { provider, rows } = await getMarketSnapshots([]);
  if (!rows.length) {
    return NextResponse.json({
      status: 'INSUFFICIENT_DATA',
      provider,
      pulse: calculateTrendPulse({ snapshots: [] }),
      message: 'No live market observations are available. Configure a provider; demo values are intentionally disabled.',
    }, { status: 503 });
  }
  return NextResponse.json({
    status: 'LIVE',
    provider,
    pulse: calculateTrendPulse({ snapshots: rows }),
  });
}
