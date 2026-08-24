# Phase 2F — Large / Mid / Small Cap Pulse

## Implemented foundation

- Cap-pulse domain contracts
- Large / Mid / Small calculation engine
- Cap-pulse API contract
- Market-cap classification schema
- Rank-to-segment helper
- No-guess classification policy

## Classification

The current market-cap classification snapshot must come from the approved
AMFI/SEBI methodology and be stored with an effective date.

Rank mapping used by the engine:
- 1–100: Large
- 101–250: Mid
- 251+: Small

This is an engine rule; the actual company ranking must come from the current
classification snapshot.

## Current status

The API deliberately returns INSUFFICIENT_DATA until the live classification
snapshot is loaded. Live quotes alone are not enough to safely label companies
as Large/Mid/Small.

## Next integration

Load the approved classification universe, join it to the normalized quote
universe, then calculate:
- Large Cap Pulse
- Mid Cap Pulse
- Small Cap Pulse
- relative strength by segment
- segment breadth
- capital rotation / leadership
