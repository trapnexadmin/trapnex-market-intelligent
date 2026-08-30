# Phase 4B — News Scoring + Danger Radar

## Implemented
- Explainable news feature inference
- Event-level News Score
- Event-level Risk Score
- Danger Signal calculation
- News API returns scored events
- Danger API returns scored events and aggregate signal
- News Center is user-visible
- Danger Radar is user-visible
- Persistence schema for scored news and danger history

## Scoring policy
Keyword/time-window inference is a transparent fallback. It is not presented
as human-level semantic intelligence.

The next production layer should combine provider sentiment, event taxonomy,
source reliability and Google AI Studio classification.

## Current scope
Stock-specific news is supported.
Market-wide/global aggregation is intentionally not yet complete.

## Next
Phase 4C:
- Google AI Studio/LLM event classification
- India + global market news
- source reliability
- market-wide Danger Radar
- Risk/Trap Shield feed into Stock Intelligence
- AI explanation with source links
