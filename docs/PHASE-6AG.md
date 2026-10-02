# Phase 6AG — Portfolio Holdings Persistence

Base: Phase 6AF commit `fcb2102f073ace117ede79cf103fc892e6da3839`.

Adds persistent holdings storage and CRUD APIs for the portfolio layer.

- Supabase-backed holdings keyed by a portfolio key.
- Symbol, exchange, quantity and average price are editable.
- Zero quantity removes the holding.
- Portfolio allocation snapshots can be persisted.
- New API: `/api/portfolio/holdings`.

This phase stores portfolio state; allocation remains model-driven and does not guarantee returns.