# Phase 6E — Unified Pulse Context Integration

## Purpose
Connect the Phase 6D unified market pulse layer to the existing Opportunity
Engine without fabricating missing market or classification data.

## Changes
- Added `lib/opportunity/unified-context.ts`.
- Opportunity API now resolves unified NIFTY, cap and sector pulse context
  for each requested symbol.
- The symbol's validated classification determines its cap and sector pulse.
- Market/cap/sector provenance and errors are returned with every opportunity.
- Missing market observations, classifications, cap pulse or sector pulse
  produce `INSUFFICIENT_DATA` instead of a synthetic score.

## Existing Opportunity Engine
`aggregateProviderContext()` already passes `marketPulse` and `sectorPulse`
into `calculateOpportunity()`. Phase 6E now supplies those values from the
unified pulse layer instead of leaving them null.

## Important
The classification registry remains process-memory based in the current
repository. A production refresh should be persisted and loaded at startup
before enabling broad universe scans.

## API
`GET /api/opportunities?symbol=RELIANCE`

Response now includes:
- `opportunity`
- `marketContext`
- `sources`
- `errors`
- technical context

## Next
Phase 6F — persistent classification loading + Stock Intelligence integration,
followed by validation of the full Stock → Market Regime → Opportunity chain.
