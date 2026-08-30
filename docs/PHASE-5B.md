# Phase 5B — Opportunity Trade Plan Foundation

## Compile fix
The Phase 5A API incorrectly referenced `Opportunity.status`. The domain model
uses `Opportunity.decision`. The route must use `opportunity.decision`.

## Implemented
- compile-safe Opportunity API route
- trade-plan calculation contract
- entry / stop-loss / target validation
- upside/downside percentage
- risk/reward calculation
- minimum-input validation
- opportunity trade-plan persistence schema
- Opportunities page user guidance

## Important
No entry, stop, target or expected return is fabricated. The plan is valid only
when real validated technical levels exist.

## Next
5C — connect actual technical support/resistance and current price to produce
real entry/SL/target candidates, then rank 10%+ opportunities.
