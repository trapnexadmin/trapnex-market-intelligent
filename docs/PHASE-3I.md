# Phase 3I — Dashboard Data Truth

## Goal
Remove misleading hard-coded market intelligence from the dashboard.

## Rules
- Market values must come from APIs.
- If data is missing, render an explicit unavailable state.
- Never label static values as LIVE.
- Portfolio values must come from portfolio data, not placeholder numbers.
- News headlines must come from the news pipeline.
- Breadth/cap/sector cards must consume their API contracts.

## Current repository finding
The dashboard still contains hard-coded ticker, market breadth, portfolio and
news values even though the provider/data contracts exist.

## Planned bindings
- ticker → market index API
- NIFTY Pulse → `/api/market/pulse`
- breadth → `/api/market/breadth`
- sector → `/api/market/sector-pulse`
- stock opportunities → opportunity API when available
- news → news API when available
- portfolio → portfolio API when implemented

## Next
3J — Complete Stock Intelligence factors and connect the stock detail UI.
