# Phase 6Q — Institutional Flow, Corporate Actions & Event Intelligence

## Included

- Institutional-flow provider abstraction and explicit provider health.
- NSE institutional ingestion behind an explicit feature flag.
- NSE corporate-action retrieval for per-symbol event context.
- Existing Finnhub company news + Google AI Studio scoring wired into Stock Intelligence.
- Danger aggregation and news-event factor integration.
- Event endpoint: `GET /api/stock-intelligence/events?symbol=RELIANCE`
- Extended provider health endpoint.
- Persistence schema for institutional flow, corporate actions and scored news events.

## Integrity

NSE institutional/corporate-action endpoints can change format or require exchange-session/browser headers. Ingestion is provider-gated and returns null/empty results instead of inventing data.

AI scoring is only used when Google AI Studio responds with structured JSON.

## Apply

This package is a Phase 6Q delta for the verified Phase 6P `main` state. Apply it on top of the Phase 6P repository; it is not a full repository clone.

## Next

6R should resolve market/sector context and connect the completed factor contract into opportunity ranking with full-universe batching.
