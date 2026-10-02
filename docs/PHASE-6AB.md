# Phase 6AB — Opportunity Liquidity Integration

Base commit: Phase 6AA
`4840260a38a95f00dba1ab35406e0bd93d0c2008`

## Changes

### 1. Liquidity is now connected to opportunity ranking

`runFullOpportunityRanking()` now calculates liquidity from the latest
20 historical candle sessions and passes the resulting score into
`calculateOpportunity()`.

### 2. No synthetic liquidity

Liquidity remains `null` when:

- fewer than 5 usable observations exist
- volume data is insufficient
- configured turnover thresholds are invalid

The ranking engine does not invent a fallback liquidity score.

### 3. Liquidity provenance

Every ranked row exposes:

- `liquidity.score`
- `liquidity.source`
- `liquidity.windowSessions`
- `liquidity.available`
- `liquidity.reason`

The source is explicitly `historical_candle_turnover`.

### 4. Ranking integrity metadata

The ranking response now exposes:

- quote availability
- historical availability
- liquidity availability
- market pulse availability
- sector pulse availability
- cap pulse availability

It also exposes aggregate `rankingIntegrity` metadata.

## Environment

```env
LIQUIDITY_TURNOVER_FLOOR=10000000
LIQUIDITY_TURNOVER_CEILING=10000000000
```

These are configurable scoring bounds, not claims about universal market
liquidity thresholds.

## GitHub status

This package is prepared against verified Phase 6AA `main`.

If GitHub write access is unavailable, this ZIP is the authoritative Phase 6AB
patch and should be applied on top of commit `4840260a38a95f00dba1ab35406e0bd93d0c2008`.
