# Phase 6D — Unified Pulse Integration

## Verified
Latest GitHub Phase 6C commit: `d9bbc69`.

The existing NIFTY pulse route uses the repository's market snapshot provider
and the pulse engine already calculates weighted trend, breadth, momentum,
volume, relative strength, news and risk factors.

## Implemented
- classification-aware snapshot subsetting
- unified NIFTY pulse
- Large/Mid/Small pulse integration
- sector pulse integration
- unified market-pulse API
- user-visible Market Intelligence page
- persistence schema

## Safety
If classifications or market observations are unavailable, the API returns
`INSUFFICIENT_DATA` rather than assigning arbitrary buckets.

## Next
Phase 6E — connect unified Market Pulses into Stock Intelligence and the
Opportunity Engine so candidate scores receive market, cap and sector regime
context with provenance.
