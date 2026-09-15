# Phase 6F — Persistent Classification + Stock Intelligence Integration

## Base
Phase 6E is committed as `2748f78cdbea52c57ff0bc1dc7893ce02f3187a6`.

## Changes
- Added a classification persistence seam.
- Registry writes now flow through the persistence seam.
- Added classification readiness endpoint.
- Added market-regime adapter for Stock Intelligence.
- NIFTY, cap and sector pulses can contribute to sector alignment.
- Missing pulse data remains explicit.

## Database
Added `classification_snapshots` schema for Supabase/Postgres binding.
No unverified database credentials or live connection assumptions are made.

## Safety
This remains a screening model. It does not guarantee returns.
