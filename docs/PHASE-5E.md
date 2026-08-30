# Phase 5E — Opportunity Engine Integration

## Verified
Phase 5D is committed on `main`.

## Implemented in this package
- opportunity-score helper
- opportunity ranking helper
- real Opportunities page API consumer
- explainable OpportunityCard
- ranking persistence schema

## Important current state
The current repository's provider APIs are not yet joined into a single
server-side opportunity aggregation query. The existing opportunity endpoint
therefore remains a strict readiness gate and returns `INSUFFICIENT_DATA` until
verified inputs exist.

## Next
Phase 5F:
- aggregate real Stock Intelligence
- aggregate NIFTY Pulse
- aggregate Sector Pulse
- aggregate Risk/Trap Shield
- connect technical levels
- calculate real expected return
- rank actual 10%+ candidates
- remove the hard-coded example symbol from the Opportunities page.
