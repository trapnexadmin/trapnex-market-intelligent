# Phase 3D — Real Factor Integration Boundary

## GitHub verification
Phase 3C is committed on `main` as commit `f1f9b8f`.

## What Phase 3C delivered
- Stock detail route `/stocks/[symbol]`
- Stock search endpoint
- Instrument lookup
- LTP lookup
- Intelligence readiness UI
- Explainable score UI

## Phase 3D
This package strengthens the factor boundary:
- real technical calculator is wired
- real fundamental/valuation/institutional calculators are wired
- provider-derived inputs remain required
- no synthetic scores are generated
- factor source persistence is defined

## Important
The current repository does not yet contain the server-side provider ingestion
needed to populate fundamentals, historical candles, institutional flow, news,
and risk factors. Those should be integrated through provider adapters before
the score can become fully populated.

## Next
Complete provider ingestion for:
- Finnhub fundamentals
- Alpha Vantage cross-checks
- Angel One historical candles
- institutional flow
- news/risk signals
Then make `/stocks/[symbol]` the canonical stock intelligence workspace.
