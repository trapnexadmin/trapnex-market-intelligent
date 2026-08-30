# Phase 5F — Opportunity Context Integration

## Verification
The repository has Phase 5B/5C/5D/5E opportunity work on `main`. The Opportunity
API uses `opportunity.decision` and the repository CI status currently reports no
checks.

## Implemented
- unified Opportunity Context boundary
- Stock Intelligence adapter
- expected-return/downside derivation from validated trade levels
- Opportunity Table with return/downside/risk-reward/confidence
- persistence for opportunity context snapshots

## Current limitation
The actual provider aggregation is still intentionally pending. The endpoint
must not fabricate market/sector/risk/technical inputs, so it may return
INSUFFICIENT_DATA until those adapters are joined.

## Next
5G — real server-side aggregation of Stock Intelligence + NIFTY Pulse +
Sector Pulse + Risk Shield + Technical Levels, then ranked 10%+ candidates.
