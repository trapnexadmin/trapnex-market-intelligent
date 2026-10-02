# Phase 6AH — Portfolio Holdings UX + Actual vs Model

Base: Phase 6AG commit `2eb8c0ac9bffa34ef4d45ca25e583e06b97df945`.

Adds a portfolio overview API and connects the Portfolio screen to persistent holdings.

## Included

- Fetch persisted holdings and the current model allocation together.
- Add/update holdings from the Portfolio UI.
- Remove holdings from the Portfolio UI.
- Show recorded actual portfolio weight versus model target weight and drift.
- Show model-only allocations that are not currently held.
- Preserve the Phase 6AD–6AG allocation and persistence layers.

## Data caveat

Actual book value is calculated from recorded quantity × average price. It is not live market value and it does not calculate live P&L yet. A future quote integration should provide current prices before using market-value drift for monitoring.

## Security caveat

The current persistence API uses a `portfolioKey` rather than an authenticated user id. This is a keyed application layer, not production multi-user authorization. RLS/user ownership should be added before exposing portfolio data broadly.
