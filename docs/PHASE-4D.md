# Phase 4D — India/Global Market News + Danger Radar

## Implemented
- India/general market news ingestion boundary
- Global market news mode
- Google AI Studio scoring integration
- score/risk withheld when AI is unavailable rather than guessed
- market danger aggregation
- News Center India/Global UI
- Danger Radar market UI
- persistence schemas

## Important
The current Finnhub general-news endpoint is used as the market-news source
boundary. India-specific relevance filtering and a second independent provider
should be added before production to improve coverage and reduce single-source
risk.

## Next
Phase 4E:
- source reliability/reconciliation
- India-specific + global macro feeds
- Risk/Trap Shield factor
- integrate news/risk into Stock Intelligence
- alert-ready event model.
