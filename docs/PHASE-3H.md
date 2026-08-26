# Phase 3H — Real Navigation + Stock Entry Point

## Purpose
Phase 3G created route/page boundaries, but the dashboard sidebar still used
plain buttons and did not navigate. Phase 3H introduces real Next.js links.

## Functional user path
Dashboard → Stocks → Stock Intelligence → `/stocks/[symbol]`

Examples:
- `/stocks/RELIANCE`
- `/stocks/TCS`
- `/stocks/M%26M`

## Navigation states
- Active route is highlighted.
- Child stock routes keep Stocks active.
- Coming-soon items can be disabled explicitly.
- Accessible pages use real Next.js `Link`.

## Existing Stock Intelligence APIs
- `/api/stocks/search?q=...`
- `/api/stocks/intelligence?symbol=...`
- `/api/stocks/candles?symbol=...`
- `/api/stocks/news?symbol=...`
- `/api/providers/fundamentals?symbol=...`

## Next
Phase 3I — remove remaining demo dashboard values and bind dashboard panels
to verified live APIs.
