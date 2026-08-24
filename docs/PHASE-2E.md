# Phase 2E — NIFTY Trend Pulse

## Implemented

- NIFTY 50 Pulse API contract
- Provider-neutral NIFTY Pulse adapter
- Existing trend/momentum/volume scoring reused from the intelligence engine
- Explicit LIVE / INSUFFICIENT_DATA / PROVIDER_ERROR states
- Provider and fallback metadata
- No synthetic market values

## Current factor model

| Factor | Weight |
|---|---:|
| Trend | 20% |
| Breadth | 15% |
| Momentum | 15% |
| Volume | 10% |
| Relative Strength | 15% |
| News | 10% |
| Risk Regime | 15% |

The engine renormalizes weights when optional inputs are unavailable.

## Important

This phase exposes the NIFTY Pulse contract and calculation path, but it does
not claim that all seven factors are live yet.

Breadth, news and risk remain optional until their real providers are connected.
Missing factors reduce confidence instead of being replaced by fabricated values.

## API

`GET /api/market/nifty-pulse`

Expected states:

- `LIVE` — at least one real market snapshot is available.
- `INSUFFICIENT_DATA` — no real market observation is available.
- `PROVIDER_ERROR` — provider/runtime failure.

## Next

Phase 2F:
- Large-cap pulse
- Mid-cap pulse
- Small-cap pulse
- market-cap universe classification
- cap-segment relative strength
- cap-segment breadth
- cross-segment rotation score
