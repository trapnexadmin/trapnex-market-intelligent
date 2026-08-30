# Phase 5K — Historical Candles + Real Trade Levels

## Verified
The current GitHub Phase 5I commit is `d8646f0`.
Its live-context implementation only checks credentials and returns null context.

The repository already contains a real Angel One `getLtpData()` implementation.

## Implemented
- instrument lookup through the existing Angel One instrument master
- Angel One live LTP reuse
- 180-day daily historical candle retrieval
- support/resistance technical-plan generation
- Entry / Stop Loss / Target derivation
- expected-return / downside / risk-reward derivation
- opportunity API exposes technical provenance
- Opportunities page shows real technical provenance
- persistence schema for technical snapshots
- explicit React keys in rendered provider rows

## Important
The 10%+ threshold is a screening rule, not a guaranteed return.
A candidate is not promoted from missing data.

## Next
Phase 5L:
- connect Stock Intelligence score to the same live historical context
- connect NIFTY Pulse and Sector Pulse
- connect Risk/Trap Shield
- derive final risk-adjusted opportunity score
- show Entry / SL / Target directly in ranked candidates
