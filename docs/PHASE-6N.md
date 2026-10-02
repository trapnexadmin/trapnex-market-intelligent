# Phase 6N — Stock Intelligence integration

6N consumes the validated 6M quote pipeline inside the existing Stock Intelligence engine.

## Included
- Validated provider quote -> Stock Intelligence integration seam
- Explicit missing-data behavior; no fabricated fundamentals, valuation, or institutional inputs
- Risk Trap Shield wired into the live engine
- Market/cap/sector pulse context accepted by the engine
- Live Stock Intelligence endpoint: `GET /api/stock-intelligence/live?symbol=RELIANCE`
- Persistence schema for Stock Intelligence snapshots

## Important data rule
A single live quote is not treated as a 50-candle technical history. The live endpoint may therefore remain `INSUFFICIENT_DATA` until a real historical-candle provider is mapped. This prevents synthetic trend scores from being presented as historical evidence.

## Next
6O should add provider-backed historical candles and fundamental/valuation data adapters, then persist complete factor snapshots and connect them to Opportunity ranking.
