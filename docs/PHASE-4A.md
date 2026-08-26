# Phase 4A — News Event Intelligence + Danger Radar

## Implemented
- Finnhub company-news ingestion adapter
- News event normalized contract
- News API
- Danger signal calculation foundation
- Danger API
- News Center page boundary
- Danger Radar page boundary
- Persistence schema

## Current limitations
Raw news is available, but final AI/materiality/sentiment scoring is not yet
provider-complete. Missing scores remain unavailable instead of guessed.

Market-wide Danger Radar requires multi-source/global news ingestion.

## User path
Dashboard → Intelligence → News Center
Dashboard → Intelligence → Danger Radar
Stock Detail → News/Risk panels (next binding step)

## Next
4B — AI news scoring, multi-source reconciliation, global/India market news,
risk/trap shield, stock intelligence integration, and alert-ready events.
