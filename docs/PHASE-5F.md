# Phase 5F — Opportunity Universe + Ranking

## Verified
Phase 5A/5B/5C/5D/5E opportunity contracts are present on main.
The current API correctly uses `opportunity.decision`.

## Implemented
- India liquid universe boundary
- ranking helper
- expected-return model
- Opportunities page now consumes the universe endpoint
- ranked table component
- persistence schema for universe runs/rankings

## Current limitation
The repository's separate provider pipelines are not yet aggregated into the
opportunity endpoint. Therefore the universe correctly returns
INSUFFICIENT_DATA instead of inventing 10%+ candidates.

## Next
Phase 5G:
- server-side provider aggregation
- Stock Intelligence context
- NIFTY Pulse
- Sector Pulse
- Risk Shield
- technical levels
- real expected return
- candidate ranking with complete provenance.
