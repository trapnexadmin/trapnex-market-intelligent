# Phase 5H — Provider Aggregation

## Verified before continuation
The GitHub Opportunity API still had all provider fields set to null. The
scoring engine was already ready to consume those fields.

## Implemented in this package
- provider quote normalization contract
- provider context boundary
- technical plan derivation from validated candles
- aggregate opportunity function
- Opportunities UI consumes the aggregate endpoint
- provider snapshot persistence schema

## Critical limitation
Provider credentials/adapters must be connected to actual provider calls before
the engine can produce live candidates. This package deliberately returns
INSUFFICIENT_DATA when those inputs are unavailable.

## Next
Phase 5I — connect existing Angel One / IndianAPI / Finnhub / Alpha Vantage /
NSE-BSE adapters, normalize responses, collect provenance and feed real
context into the aggregation boundary.
