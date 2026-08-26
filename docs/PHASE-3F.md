# Phase 3F — Historical Candles + Technical + News Foundation

## Implemented

- Angel One daily historical candle adapter
- `/api/stocks/candles?symbol=RELIANCE`
- Technical score can now consume real candle history
- Finnhub company-news API
- `/api/stocks/news?symbol=RELIANCE`
- Stock intelligence API attempts to load real daily candles before scoring
- Historical-candle and news persistence schema

## Current remaining factors

- Institutional flow
- Sector alignment
- Risk / trap shield
- Full news event scoring

## Product behavior

A stock can now move from:
`technical = PENDING`
to:
`technical = READY`
when at least 50 valid candles are returned.

News is available as a raw intelligence feed, not yet a final 0–100 news score.

## Next

Phase 3G:
- news sentiment/impact scoring
- institutional flow provider
- sector/cap alignment
- risk/trap shield
- complete Stock Intelligence explanation
