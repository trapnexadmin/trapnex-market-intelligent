# Phase 4C — AI News Classification

## Implemented
- Google AI Studio classification adapter
- AI sentiment/materiality/impact/risk fields
- News API uses AI when `GOOGLE_AI_STUDIO_API_KEY` is configured
- Deterministic fallback remains available
- Danger API consumes the scored events
- News Center shows real scored events
- AI classification persistence schema

## AI output
- Sentiment 0–100
- Materiality 0–100
- Market impact 0–100
- Risk 0–100
- Event category
- Rationale

## Important
AI output is an intelligence input, not a guaranteed prediction. Source,
freshness and provider quality must remain visible.

Market-wide India/global aggregation and source reliability are the next
step before Danger Radar can be considered complete.

## Next
Phase 4D — India/global news aggregation, source reliability, market danger,
and Risk/Trap Shield integration into Stock Intelligence.
