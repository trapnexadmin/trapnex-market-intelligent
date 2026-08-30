# Phase 4E — Source Reliability + Risk/Trap Shield

## Implemented
- Source reliability weights
- Multi-provider evidence reconciliation contract
- Risk/Trap Shield factor contract
- Danger API exposes source count
- Risk/Trap Shield API contract
- Danger Radar UI displays source count and reasons
- Persistence schema

## Risk/Trap Shield
The shield score is a safety factor, not a buy signal. Higher score means
lower observed risk from the supplied factors.

Inputs:
- Danger score
- Leverage risk
- Governance risk
- Liquidity risk
- Abnormal price/volume

## Important
A missing factor stays missing. It is not treated as zero-risk.

## Next
Phase 5A — integrate complete Stock Intelligence:
- news score
- Risk/Trap Shield
- sector alignment
- institutional flow
- explainable decision layer
- then build the 10%+ Opportunity Engine.
