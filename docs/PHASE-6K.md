# Phase 6K — Cumulative Universe Validation & Ranking Hardening

## Verified base
Phase 6J commit:
`c7380ab79dcb3a60f1fcc6f6cc6970abacd05c11`

## Retained previous phases
- 6G: Supabase classification persistence/loading
- 6H: market regime → Stock Intelligence
- 6I: end-to-end Opportunity pipeline validation
- 6J: universe completeness, coverage and ranking

## New 6K
- provider ↔ classification coverage inspection
- explicit opportunity eligibility gate
- ranked-opportunity snapshot persistence schema
- missing market symbols exposed instead of silently ignored

## Eligibility
A row is decision-eligible only when:
- classification exists
- live market data exists
- Stock Intelligence score exists
- Opportunity context exists
- expected return exists
- Opportunity decision is `CANDIDATE` or `STRONG_CANDIDATE`

## Safety
No missing field is converted into a synthetic market or investment score.
The ranking system remains an analytical screening layer.
