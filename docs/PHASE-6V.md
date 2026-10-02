# Phase 6V — Provider-Truth & Ranking Integrity

Base: GitHub main at Phase 6T commit
`cfb2342832303b4de9619450228b692469fe0c90`.

Goals:
- Stop treating unverified provider mappings as production-grade data.
- Make institutional-flow and corporate-action ingestion fail closed.
- Add an explicit market-data capability report.
- Keep Opportunity ranking honest when live quotes, breadth, or verified institutional data are unavailable.
- Preserve null / INSUFFICIENT_DATA rather than silently substituting values.

The GitHub connector returned HTTP 403 while attempting to create the Phase 6V branch, so this is a cumulative local delta and is not claimed as a GitHub commit.
