# Phase 3B — Real Stock Factor Engine Foundation

## Completed in this changeset

- Technical structure calculator from OHLCV candles
- Fundamental quality normalization
- Valuation normalization
- Institutional-flow normalization
- Factor snapshot persistence schema
- Dashboard React key-fix script

## Technical score

Uses:
- 20 DMA relationship
- 50 DMA relationship
- RSI(14)
- volume participation

The calculator requires at least 50 valid candles and returns `null` rather than inventing a score.

## Provider integration rule

Provider adapters must populate normalized contracts. The intelligence engine must not contain provider-specific parsing.

Target flow:

Provider
→ adapter
→ normalized factor input
→ factor calculator
→ stock intelligence engine
→ historical snapshot

## Next integration

Connect real providers already available in the project:
- Angel One / IndianAPI market data
- Alpha Vantage
- Finnhub
- fundamental/company-data providers
- news providers

Then add:
- historical factor persistence
- factor freshness
- multi-provider reconciliation
- explainable stock page
- Opportunity Engine
