# Phase 6L — Real Indian Equity Universe

## Cumulative baseline

6G: durable classification persistence/loading.
6H: market regime → Stock Intelligence.
6I: Stock Intelligence → Opportunity pipeline validation.
6J: universe completeness and ranking.
6K: provider coverage and eligibility hardening.

## New 6L

6L introduces a normalized equity-universe layer:

- NSE/BSE exchange identity
- provider-specific symbol
- company name and optional ISIN
- Large/Mid/Small classification
- sector and industry
- active/listed status
- source and effective date
- snapshot timestamp

## APIs

`POST /api/universe/refresh`
Loads and validates a normalized universe snapshot.

`GET /api/universe/status`
Returns current in-process universe coverage.

## Database

Apply `database/phase6l.sql` to create durable universe snapshots.

## Important

This phase does not invent an NSE/BSE security list. A trusted provider/export
must supply the rows to `/api/universe/refresh`. Unknown or incomplete fields
remain explicit, and invalid/unlisted rows are rejected from the active universe.

## Next

6M should connect this normalized universe to the production market-data
provider so the actual scan operates on the active universe rather than a
manually maintained seed list.
