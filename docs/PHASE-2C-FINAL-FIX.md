# Phase 2C Final Pulse Fix

## Why the previous hotfix was insufficient

Changing HTTP 503 to HTTP 200 only changed the transport status. It did
not produce market observations.

The actual code path was:

Angel One `getQuotes()` -> `[]`
IndianAPI batch endpoint with an empty list -> no valid request/data
registry -> `rows=[]`
pulse -> `INSUFFICIENT_DATA`

## Correct solution

1. IndianAPI `/trending?exchange=NSE` is now used when the pulse requests the
   market universe without explicit stock symbols.
2. Trending gainers and losers are normalized into `MarketQuote`.
3. If stock quotes are unavailable, the registry falls back to documented
   IndianAPI `/indices?exchange=NSE&index_type=POPULAR`.
4. NIFTY 50 / BANK NIFTY / SENSEX are converted to MarketSnapshot using
   current value and `price - netChange` as previous close when an explicit
   previous close is not supplied.
5. The Pulse endpoint now receives actual market observations rather than
   merely changing 503 to 200.
6. No demo values are generated.

IndianAPI documents `/trending` as returning top gainers/losers with price,
close, volume, date/time and exchange data, and documents `/indices` as
returning NIFTY 50, Bank Nifty and other benchmark index values.

## Important

If the market is closed and the provider explicitly returns no market data,
`INSUFFICIENT_DATA` remains a valid state. The application cannot honestly
manufacture live values.

If `INDIANAPI_API_KEY` is configured and the provider returns market data,
the pulse should return `LIVE`.

## React warnings

The ticker and portfolio health arrays now use stable keys.
Run the included script if those two blocks still match the old source:

`node scripts/fix-page-keys.cjs`
