# Phase 6M — Production Market Data Pipeline

6M adds the production quote-ingestion foundation on top of the 6L normalized universe and 6K provider/eligibility architecture.

## Included
- Batch quote synchronization across the active normalized universe
- Quote quality validation
- Persistent market-data runs and normalized quotes
- Provider health endpoint
- Direct quote endpoint
- Universe-wide sync endpoint
- Explicit READY/PARTIAL/INSUFFICIENT_DATA/PROVIDER_ERROR states

## APIs
- GET /api/market/health
- POST /api/market/quotes
- POST /api/market/sync
- GET /api/market/coverage

## Provider rule
The existing provider registry remains the abstraction boundary. IndianAPI's existing batch quote implementation can supply real observations when configured. Angel One authentication exists in the repository, but its current quote method is not treated as a live quote source until it returns real observations.

## Data integrity
Invalid price, timestamp, high/low consistency, and numeric fields are rejected. Missing market data is never converted into a synthetic price or score.

## Database
Apply database/phase6m.sql after the Phase 6L schema.

## Next
6N consumes validated market observations for the Stock Intelligence factor engine. Historical candles require provider-specific instrument/reference mapping and are intentionally not fabricated in this phase.
