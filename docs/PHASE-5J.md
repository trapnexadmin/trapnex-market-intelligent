# Phase 5J — Real Provider Wiring

## Verified repository implementation
The repository already contains `lib/providers/angelone/quotes.ts` with
`getLtpData()`, which calls Angel One SmartAPI and returns normalized
`MarketQuote` data.

## Implemented
- provider adapter interface
- fallback/error-isolated quote resolver
- real Angel One quote adapter
- server-side provider context
- API provider diagnostics
- Opportunities page provider diagnostics
- provider run/quote persistence schema
- React list keys are explicit

## Angel One token
The adapter expects:
`ANGELONE_SYMBOL_TOKEN_<SYMBOL>`

Example:
`ANGELONE_SYMBOL_TOKEN_RELIANCE=...`

Credentials remain server-side.

## Important
A quote alone is not enough to declare a 10%+ opportunity. Stock intelligence,
market pulse, sector pulse, risk shield and technical candles must also be
verified before a candidate is promoted.

## Next
Phase 5K — wire the repository's actual historical-candle/instrument resolver,
then connect Stock Intelligence, NIFTY Pulse, Sector Pulse and Risk Shield.
