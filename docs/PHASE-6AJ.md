# Phase 6AJ — Portfolio Snapshot History

Base: Phase 6AI commit `728d9b23f064a3052401a1186b21fd78881393f8`.

Adds read access to historical portfolio allocation snapshots.

## Included

- `GET /api/portfolio/snapshots`
- Reusable `listAllocationSnapshots()` persistence helper.
- Returns recent model allocation snapshots for a portfolio key.
- Preserves the existing 6AG holdings, 6AH portfolio comparison, and 6AI snapshot-write layers.

## Notes

Snapshots are historical model records. They are not executed orders, live portfolio valuation, or performance guarantees.
The current `portfolioKey` model remains application-level scoping; authenticated ownership/RLS is still a later production-hardening phase.
