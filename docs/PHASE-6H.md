# Phase 6H — End-to-End Stock Intelligence → Opportunity Integration

## Verified base
Phase 6G commit:
`688c49afcd6fde320f34cee7dac494e935dd9cdb`

## Changes
- Stock Intelligence engine now actually applies the existing market-regime
  adapter when a market context is supplied.
- Added Opportunity diagnostics so missing market or technical context is
  explicit.
- Kept the existing Opportunity calculation thresholds unchanged.
- Missing data never becomes a synthetic score.

## Pipeline
Classification
→ NIFTY/Cap/Sector Pulse
→ Stock Intelligence market-regime adapter
→ Stock Intelligence score
→ Technical plan / return model
→ Opportunity Engine
→ Candidate decision

## Validation targets
A candidate is only considered decision-eligible when the existing Opportunity
Engine returns `CANDIDATE` or `STRONG_CANDIDATE`. The diagnostics layer exposes
missing market/technical inputs independently of that decision.

## Safety
The score remains a screening signal and not a guaranteed-return forecast.
