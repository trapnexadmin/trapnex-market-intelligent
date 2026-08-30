# Phase 5I — Live Provider Aggregation Boundary

## Implemented
- server-only provider context loader
- provider availability/status reporting
- normalized Opportunity aggregation
- universe endpoint consumes live context boundary
- no browser exposure of provider credentials
- provider run persistence schema

## Safety
This phase does not fabricate live quotes, candles, scores, pulses or returns.
A configured API key alone does not mean a provider returned valid market data.
Only normalized provider responses should populate the Opportunity Context.

## Environment names
The loader recognizes:
- ANGELONE_API_KEY
- INDIAN_API_KEY
- FINNHUB_API_KEY
- ALPHA_VANTAGE_API_KEY

Map these names to the repository's actual secret names when wiring each
existing provider implementation.

## Next
Phase 5J — connect the repository's existing provider functions one by one,
normalize their real response shapes, add source timestamps/provenance, and
feed validated quotes/candles/fundamentals/news into the Opportunity Engine.
