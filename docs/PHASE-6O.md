# Phase 6O — Historical market data foundation

6O replaces the 6N single-observation limitation with real provider-backed daily historical candles.

## Included
- Angel One instrument-master resolution for NSE/BSE cash equities
- Angel One historical candle adapter
- Date-range chunking within documented interval limits
- Historical candle resolver abstraction
- Historical candle API
- Complete Stock Intelligence integration endpoint using real daily candles
- Persistence schema for candles, fundamentals, valuation, and complete Stock Intelligence snapshots

## Provider evidence
Angel One's official SmartAPI documentation exposes a historical candle endpoint requiring exchange, symbol token, interval, from-date and to-date. It supports daily candles and documents maximum request windows by interval. The instrument master provides the token mapping used by the historical endpoint. 

## Data integrity
6O does not invent fundamental, valuation, institutional, or news values. Those remain explicitly missing until a real source is connected. Technical scoring is only based on the returned historical candles; the 6N synthetic one-row quote is used only as a fallback and cannot satisfy the 50-candle technical requirement.

## APIs
- `GET /api/stock-intelligence/history?symbol=RELIANCE&days=120`
- `GET /api/stock-intelligence/complete?symbol=RELIANCE`

## Next
6P should connect real fundamental/valuation sources, persist complete observations, and remove the remaining missing factors from the Stock Intelligence contract.
