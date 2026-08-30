# Phase 6C — Classification Refresh & Validation

## Implemented
- classification validation contract
- effective-date freshness validation
- refresh service
- server refresh endpoint
- status endpoint
- canonical in-memory registry boundary
- cap/sector query helpers
- classification status page
- refresh-run persistence schema

## Safety
No seed classifications are automatically treated as authoritative. A refresh
is accepted only when source, effective date, cap bucket and sector are present
and classification freshness passes the validation window.

## Refresh endpoint
POST `/api/classification/refresh`

Payload:
- `source`
- `effectiveDate`
- `rows[]`

## Next
Phase 6D — connect the validated classification registry to the existing
NIFTY/cap/sector Pulse calculations and expose unified Pulse APIs.
