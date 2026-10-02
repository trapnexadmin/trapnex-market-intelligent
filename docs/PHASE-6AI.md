# Phase 6AI — Portfolio Snapshot Persistence

Base: Phase 6AH commit `3e728d54d2d3fca44a44940fdef38c0c5aa92abf`.

Adds an API endpoint to persist a generated portfolio allocation plan as a historical snapshot.

## Included

- `POST /api/portfolio/snapshot`
- Validates a basic allocation-plan payload.
- Stores capital, risk profile, and the complete model allocation JSON in the existing `portfolio_snapshots` table.
- Keeps the existing holdings CRUD and model allocation flow unchanged.

## Notes

Snapshots are historical model records. They do not represent executed trades or guarantee performance.
