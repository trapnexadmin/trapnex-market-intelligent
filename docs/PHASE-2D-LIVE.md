# Phase 2D — Live Breadth Integration

## Verification result
The GitHub repository now contains the Phase 2D calculation engine, persistence
schema and API contract.

## Live integration included in this changeset
`GET /api/market/breadth` now consumes the normalized market universe from the
existing provider registry.

It does not fabricate DMA values.

When only live price + previous close are available:
- Advancers
- Decliners
- Unchanged
- A/D ratio
- Breadth thrust
- Price breadth score
can be calculated.

20/50/200 DMA participation remains explicitly unavailable until historical
daily candles are connected.

This is intentional and prevents false precision.

## Next dependency
Historical daily OHLCV → DMA20 / DMA50 / DMA200 → full breadth confidence.
