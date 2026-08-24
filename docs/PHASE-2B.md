# TRAPNEX Phase 2B — Angel One Live Market Data

## Completed in this changeset

1. Angel One authentication with JWT, refresh token and feed token.
2. Daily instrument master loader with in-memory 24h cache.
3. Symbol/token/exchange resolution.
4. REST LTP quote integration.
5. Angel One WebSocket V2 connection manager.
6. Subscription and reconnect handling.
7. Heartbeat handling.
8. Normalized live tick contract.
9. Quote/instrument/stream/status API routes.
10. Phase 2B PostgreSQL tables.
11. Optional dedicated stream worker.

## Official Angel One references

- Instrument master:
  https://margincalculator.angelone.in/OpenAPI_File/files/OpenAPIScripMaster.json
- LTP:
  POST /rest/secure/angelbroking/order/v1/getLtpData
- WebSocket V2:
  wss://smartapisocket.angelone.in/smart-stream

## Environment

Required:
- ANGEL_ONE_API_KEY
- ANGEL_ONE_CLIENT_CODE
- ANGEL_ONE_PASSWORD or ANGEL_ONE_PIN
- ANGEL_ONE_TOTP_SECRET

Optional:
- ANGEL_ONE_STATE
- ANGEL_ONE_CLIENT_LOCAL_IP
- ANGEL_ONE_CLIENT_PUBLIC_IP
- ANGEL_ONE_MAC_ADDRESS

## Example

GET:
`/api/angelone/instruments?q=RELIANCE`

GET:
`/api/angelone/quote?symbol=RELIANCE&exchange=NSE`

POST:
`/api/angelone/stream`

Body:
`{"exchange":"NSE","tokens":["2885"],"mode":1}`

GET:
`/api/angelone/status`

## Important production boundary

The stream manager is Node-runtime code. Serverless environments may terminate long-lived WebSocket processes. For production, use the included worker/service boundary and a shared store such as Redis for live state. Do not depend on process memory for multi-instance production.

## Phase 2B does not yet implement

- NIFTY Trend Pulse
- breadth calculations
- sector pulse
- stock intelligence score
- news score
- portfolio allocation
- trade/order execution

Those belong to later phases.
