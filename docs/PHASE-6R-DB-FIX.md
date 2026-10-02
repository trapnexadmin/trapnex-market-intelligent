# Phase 6R DB Fix

The first 6R SQL draft could fail with:

ERROR: 42703: column "calculated_at" does not exist

That happens when `stock_factor_snapshots` already exists with a different schema. The corrected migration does not touch that table.

Instead it creates:
- `stock_intelligence_runs`
- `stock_intelligence_run_factor_snapshots`

It also updates `snapshot-store.ts` to persist to the new phase-specific table.

Apply `database/phase6r.sql` from this package. You do not need to delete the existing Phase 6P/6Q tables.
