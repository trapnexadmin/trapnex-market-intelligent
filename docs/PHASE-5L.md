# Phase 5L — Final Opportunity Integration

## Purpose
Bring Stock Intelligence, technical levels and risk/market factors into one
strict opportunity decision path.

## Implemented
- final signal contract
- centralized thresholds
- score/confidence gating
- Opportunities UI focused on candidate decisions
- final opportunity persistence schema
- explicit no-candidate state

## Candidate rules
A candidate must have:
- expected return >= 10%
- score >= 60
- confidence >= 60%
- strong candidate additionally targets score >= 75 and R/R >= 1.5

These are screening rules, not a profit guarantee.

## Important
The current provider aggregation must still supply real market pulse, sector
pulse and risk-shield values before the final ranking becomes fully populated.

## Next
Phase 6A — NIFTY Trend Pulse + Large/Mid/Small-cap Pulse + Sector Pulse with
real market breadth and trend calculations.
