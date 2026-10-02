# Phase 6R SQL Fix

The earlier migration failed with:

ERROR: 42703: column "run_id" referenced in foreign key constraint does not exist

Cause: PostgreSQL's `CREATE TABLE IF NOT EXISTS` does not validate or upgrade
the schema of an already-existing table. An older
`stock_intelligence_run_factor_snapshots` table existed without `run_id`, so
the later foreign-key/index statements operated against the old schema.

This migration is compatibility-safe:
1. Ensures `stock_intelligence_runs` exists.
2. Ensures the Phase 6R snapshot table exists.
3. Adds missing columns with `ADD COLUMN IF NOT EXISTS`.
4. Adds the `run_id -> stock_intelligence_runs(run_id)` foreign key only once.
5. Creates the required indexes.
6. Does not drop or rename existing data.

Run `database/phase6r.sql` in Supabase SQL Editor.

If Supabase reports a different existing-column/type conflict, stop there and
share that exact error before making a destructive schema change.
