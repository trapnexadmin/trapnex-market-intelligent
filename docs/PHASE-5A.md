# Phase 5A — Opportunity Engine Foundation

## Verified before implementation
Phase 4E is committed on main.

## Implemented
- opportunity domain contract
- 10%+ expected-return screening rule
- risk/reward calculation
- market/sector/risk alignment inputs
- confidence and explainable reasons
- opportunity API
- Opportunities page
- persistence schema

## Decision rules
- STRONG_CANDIDATE: expected return >= 10%, score >= 75, and RR >= 1.5 when downside is available
- CANDIDATE: expected return >= 10% and score >= 60
- WATCH: score >= 45
- AVOID: lower score
- INSUFFICIENT_DATA: missing required inputs

## Important
10%+ is a screening target, not a guaranteed profit. The engine must never
manufacture expected returns, entry prices, targets or stop-losses.

## Next
Phase 5B — integrate verified stock intelligence + market/sector/news/risk
inputs and calculate real Entry / SL / Target / expected return candidates.
