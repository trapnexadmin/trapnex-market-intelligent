# Phase 6S — Stock Intelligence Data Quality & Ranking Readiness

Base: GitHub `main` at Phase 6R compatibility commit `0346d7d1c77eaa106ba888d06a12daf671ffe7cc`.

Scope:
- Connect stock intelligence to real institutional flow where available.
- Add company corporate-action risk into the risk shield.
- Add provider/data-quality metadata so missing values stay explicit.
- Improve full opportunity ranking to use the complete 120-day historical candle series.
- Pass per-symbol market/cap/sector context into batch ranking.
- Preserve READY / INSUFFICIENT_DATA semantics and never fabricate unavailable inputs.

GitHub note:
The connected GitHub integration currently returns HTTP 403 when creating/updating refs, so this delta package is prepared locally and has not been claimed as committed.
