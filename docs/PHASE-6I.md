# Phase 6I — End-to-End Validation & Pipeline Contract

## Verified base
Phase 6H commit:
`e4fea58d3f1e15411e1319e007ab253afcbdf464`

## Changes
- Added an explicit Stock Intelligence → Opportunity pipeline helper.
- Added deterministic pipeline validation for missing market and trade context.
- Added `/api/opportunities/validate` contract endpoint.
- Existing Opportunity thresholds are unchanged.
- The pipeline keeps missing inputs explicit.

## Contract
A production candidate must have:
- a Stock Intelligence score
- market pulse
- sector pulse
- entry
- target
- stop-loss

The existing decision remains authoritative for `CANDIDATE` and
`STRONG_CANDIDATE`.

## Safety
Scores are analytical screening signals and are not guaranteed-return forecasts.
