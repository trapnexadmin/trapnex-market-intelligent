# Phase 6AA — Production Provider Truth

Base: GitHub `main` at Phase 6Z commit
`5d7f7b2b90ef1e6e75be53af6f4f4d4b0d19f0be`.

## Included changes

- Implement Angel One SmartAPI live equity quote retrieval using the documented market quote endpoint.
- Resolve NSE equity and index instruments from the Angel One instrument master.
- Remove the false Angel One `breadth` capability advertisement.
- Preserve provider errors instead of converting an empty provider response into valid market data.
- Validate market-news scope, timestamps, danger scores, and freshness.
- Add consolidated provider diagnostics at `/api/providers/diagnostics`.
- Add a reusable 20-session turnover-based liquidity score utility.
- Keep missing liquidity as `null` when insufficient volume history exists.

## Important integration note

The GitHub connector currently rejects repository write operations with HTTP 403
(`Resource not accessible by integration`). Therefore this package is a patch
against the verified 6Z `main` tree; it is not claimed as committed to GitHub.

Angel One's current SmartAPI documentation describes the `/market/v1/quote/`
endpoint as supporting up to 50 symbols per request and FULL/OHLC/LTP modes.
The implementation follows that documented contract but still requires valid
production credentials and instrument-master availability.

## Environment additions

```env
MARKET_NEWS_ENABLED=false
MARKET_NEWS_ENDPOINT=
MARKET_NEWS_API_KEY=
MARKET_NEWS_MAX_AGE_HOURS=24
LIQUIDITY_TURNOVER_FLOOR=10000000
LIQUIDITY_TURNOVER_CEILING=10000000000
```
