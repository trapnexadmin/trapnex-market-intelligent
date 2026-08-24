# Phase 2B Runtime Hotfix

## Root cause
`app/api/market/pulse/route.ts` imports `getMarketSnapshots`, but the current
`lib/providers/registry.ts` exports only `resolveQuotes`, `resolveIndices`,
and `resolveBreadth`.

That mismatch caused:

`TypeError: getMarketSnapshots is not a function`

and HTTP 500.

## Fix
Replace `lib/providers/registry.ts` with the version in this ZIP.

The compatibility function maps normalized provider quotes into the existing
intelligence `MarketSnapshot` contract.

The pulse route also now:
- uses the Node runtime
- is explicitly dynamic
- returns provider errors in the response
- keeps demo data disabled
- returns 503 for unavailable provider data instead of 500

## React warning
The existing dashboard has several `.map()` calls without stable keys.
Run:

`node scripts/fix-phase2b-runtime-keys.cjs`

This adds keys to the ticker, capital rotation, sector, opportunity, danger,
and portfolio-health list renderers.

## Verification
After applying:

`npm run build`

then:

`npm run dev`

Expected without provider credentials:

`GET /api/market/pulse 503`

with JSON status `INSUFFICIENT_DATA`, NOT HTTP 500.

Expected with a working provider:

`GET /api/market/pulse 200`

with status `LIVE`.

A 503 with `INSUFFICIENT_DATA` is a valid data-quality state when no provider
credentials/data source is configured. It is not a runtime exception.
