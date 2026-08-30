# Phase 5G — Final Opportunity Aggregation Boundary

## Verified
The Phase 5F Opportunity API currently passes null provider context and correctly
returns INSUFFICIENT_DATA. The Phase 5A model uses `decision`, not `status`.

## Implemented
- final provider context contract
- return-model derivation
- aggregation helper
- Opportunities page/table consumer
- provider-context persistence schema

## Current state
The aggregation boundary is ready, but real cross-provider joins are not yet
implemented. The system therefore remains conservative and will not create a
10%+ candidate without verified inputs.

## Next
Phase 5H — connect real providers to this boundary and generate actual
entry/SL/target, expected return, risk/reward and ranked candidates.
