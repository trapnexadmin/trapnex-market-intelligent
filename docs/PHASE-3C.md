# Phase 3C — Stock Intelligence UI + Live Identity/Quote

## What this phase adds

- `/stocks/[symbol]` stock intelligence page
- Search endpoint backed by the existing Angel One instrument master
- Stock intelligence API now resolves instrument identity and attempts live LTP
- Explainable factor UI
- Intelligence readiness matrix
- Stock intelligence readiness persistence schema
- Dashboard key-fix script

## API

`GET /api/stocks/intelligence?symbol=M&M`

`GET /api/stocks/search?q=RELIANCE`

## UI

Open:

`/stocks/M%26M`

or:

`/stocks/RELIANCE`

The page shows:
- stock identity
- live quote when configured
- Trapnex score
- confidence
- factor breakdown
- provider readiness
- missing-factor state

## Important

The score remains `INSUFFICIENT_DATA` until real factor adapters supply
fundamental, technical, valuation, institutional, sector, news and risk
inputs.

This phase intentionally does not fabricate a score.

## Next phase

3D:
- Finnhub fundamentals
- Alpha Vantage fundamentals/technical cross-check
- real historical candles
- real valuation normalization
- institutional flow source
- factor persistence
- reconciliation and freshness
