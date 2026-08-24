# Phase 2C Hotfix — Pulse 503 + React keys

## Root cause 1: Pulse 503 / insufficient data loop

`getMarketSnapshots([])` was valid at the registry level, but IndianAPI's
quote adapter returned no rows when the symbol list was empty.

The pulse route uses an empty list intentionally to request the provider's
market universe.

The adapter now treats an empty list as "all available batch market quotes".

Additionally, `GET /api/market/pulse` now returns HTTP 200 with
`status: INSUFFICIENT_DATA` when there is genuinely no provider data. This is
a normal data-quality state, not an application failure.

No demo/synthetic market values are introduced.

## Root cause 2: React key warnings

`app/page.tsx` has ticker and portfolio-health `.map()` calls whose children
have no stable React key.

Run:

```bash
node scripts/fix-page-keys.cjs
```

Or manually ensure:
- ticker item: `key={x[0]}`
- portfolio health item: `key={x[0]}`

## Verification

```bash
npm run build
npm run dev
```

Then:

```text
GET /api/market/pulse
```

Expected without configured provider:

```json
{
  "status": "INSUFFICIENT_DATA"
}
```

HTTP 200.

Expected with working IndianAPI or Angel One data:

```json
{
  "status": "LIVE",
  "provider": "...",
  "pulse": { ... }
}
```

HTTP 200.

If a provider itself fails, the response remains structured JSON with
`PROVIDER_ERROR`; the dashboard should not receive a 500 from this route.
