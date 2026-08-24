# Phase 3A — Stock Intelligence Score

## Implemented foundation

Weights:

- Fundamental Quality — 25%
- Technical Structure — 20%
- Valuation — 10%
- Institutional Flow — 15%
- Sector Alignment — 10%
- News / Event — 10%
- Risk / Trap Shield — 10%

The engine:
- normalizes each factor to 0–100
- renormalizes weights when inputs are missing
- records factor-level attribution
- emits confidence
- refuses to invent a score when all inputs are missing

## Product behavior

A high stock score must not automatically mean "BUY".

Later opportunity decisions will combine:
- Stock Intelligence Score
- NIFTY Trend Pulse
- Cap Pulse
- Sector Pulse
- Expected return
- Risk
- confidence

## Next

Phase 3B:
- real fundamentals provider adapters
- technical indicator engine from historical candles
- valuation normalization
- institutional-flow ingestion
- factor persistence and historical attribution
