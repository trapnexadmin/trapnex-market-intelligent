# Phase 5C — Technical Levels + Opportunity Ranking Foundation

## Verified first
Phase 5B is committed on `main` as:
`ab47f8f — Implement Phase 5B: Add Opportunity Trade Plan foundation...`

The Phase 5A compile defect is fixed in GitHub: the API now uses
`opportunity.decision` instead of the nonexistent `opportunity.status`.

## Implemented
- validated trade-level calculation contract
- technical support/resistance derivation
- conservative entry/SL/target candidate calculation
- opportunity level persistence schema
- opportunity API remains strict about missing intelligence inputs

## Important
The opportunity engine does not promise 10% profit. `10%+` is a screening
threshold. Real candidates require verified expected-return and risk inputs.

## Next
Phase 5D:
- connect stock intelligence score
- NIFTY pulse
- sector pulse
- risk shield
- technical levels
- derive expected return
- produce ranked 10%+ candidates
- populate Opportunities UI with real stocks.
