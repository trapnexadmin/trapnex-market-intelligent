# TRAPNEX Phase 2D — Market Breadth Engine

## Completed foundation

The breadth calculation engine now supports:

- Advancers
- Decliners
- Unchanged
- Advance/Decline ratio
- % above 20 DMA
- % above 50 DMA
- % above 200 DMA
- Advancing-volume percentage
- Breadth thrust
- Breadth score
- Data coverage/confidence
- Explicit insufficient-data state
- Supabase/PostgreSQL persistence schema
- API contract

## Important status

This phase intentionally does NOT invent a NIFTY 500 universe or fabricate DMA values.

The API returns `INSUFFICIENT_DATA` until the normalized universe/candle layer supplies real rows.

This is deliberate. The next integration step must connect the Phase 2C normalized data + historical candle storage to `BreadthUniverseProvider`.

## Calculation concept

A breadth score is derived from available, real market participation inputs. Missing components reduce confidence instead of being substituted with guessed values.

## Next

Connect:
- instrument universe
- daily candles
- 20/50/200 DMA calculation
- volume history
- breadth persistence
- dashboard breadth cards

Then feed verified breadth into NIFTY Trend Pulse.
