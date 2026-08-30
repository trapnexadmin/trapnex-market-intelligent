# Phase 6A — Market Pulse Intelligence

## Verified
Latest main commit is `3bce807` for Phase 5L.
The existing NIFTY pulse route uses `getMarketSnapshots([])` and the pulse
engine already has Trend, Breadth, Momentum, Volume, Relative Strength, News
and Risk factors. 

## Implemented
- cap pulse calculation boundary: Large / Mid / Small
- sector pulse calculation boundary
- market pulse UI
- breadth UI sourced from the existing market pulse API
- sector pulse UI
- persistence schema

## Current limitation
The cap/sector calculations currently use the normalized market snapshot
stream returned by the existing provider registry. True Large/Mid/Small and
sector membership should be supplied by a proper instrument classification
dataset before production.

## Next
Phase 6B — instrument classification + real Large/Mid/Small constituent
universe + sector mapping, then feed those subsets into the pulse engines.
