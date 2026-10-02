# Phase 6P — Fundamentals & Valuation Provider Layer

6P connects provider-backed fundamentals and valuation data into the existing Stock Intelligence engine.

## Included
- Fundamental/valuation provider abstraction
- Upstox Fundamentals adapter using ISIN
- Key ratios, income statement, balance sheet and cash-flow retrieval
- Complete Stock Intelligence engine now consumes real fundamental/valuation values when configured
- Provider health endpoint
- Institutional-flow schema for future real source integration
- Explicit missing-data behavior; unavailable factors remain `null`

## Provider evidence
Upstox documents company fundamentals endpoints keyed by ISIN, including key ratios, income statement, balance sheet and cash flow. Key ratios include P/E, P/B, ROE, ROCE and EV/EBITDA. 

## Data integrity
No values are fabricated when the provider is unavailable. Institutional flow and news remain explicitly incomplete until their source adapters are implemented.

## APIs
- `GET /api/stock-intelligence/complete?symbol=RELIANCE`
- `GET /api/stock-intelligence/providers/health`

## Next
6Q should add institutional flow + corporate actions/news-event ingestion, then connect complete factors to the Opportunity ranking pipeline.
