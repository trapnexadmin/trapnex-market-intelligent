# Phase 6J — Cumulative Real-Universe & Data Completeness

## Cumulative baseline

6J intentionally retains the complete previous pipeline:

6G
- Supabase classification persistence/loading
- latest classification bootstrap

6H
- market-regime context into Stock Intelligence
- NIFTY / cap / sector pulse integration

6I
- Stock Intelligence → Opportunity pipeline
- deterministic validation and diagnostics

## New 6J functionality

### Universe coverage
`lib/universe/coverage.ts`

Measures:
- total classified symbols
- Large/Mid/Small coverage
- sector coverage
- cap-bucket coverage

### Data completeness
`lib/universe/completeness.ts`

Each stock is assessed across:
- classification
- market data
- Stock Intelligence
- Opportunity context

A stock is eligible for ranking only when all required data is available.

### Ranking
`lib/universe/ranking.ts`

Eligible stocks with valid scores are ranked highest-score first.
Incomplete stocks remain visible for diagnostics but receive no rank.

### APIs

`GET /api/universe/coverage`

Returns current classification universe coverage.

`POST /api/opportunities/rank`

Ranks only eligible, scored opportunities.

## No synthetic data

Missing data is never replaced with a default score.

## Cumulative architecture

Classification
→ Persistent classification
→ NIFTY / Cap / Sector Pulse
→ Stock Intelligence
→ Technical / Risk context
→ Opportunity
→ Completeness validation
→ Eligible ranking
