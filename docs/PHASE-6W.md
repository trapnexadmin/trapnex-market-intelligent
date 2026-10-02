# Phase 6W — Historical Data Provider Hardening & Quality Gates

Base: GitHub `main` at Phase 6V commit `57e838f87dee2d2c2fa4561557db0b4f7d841c29`.

Focus:
- Make historical-candle ingestion explicit about provider availability.
- Prevent an authenticated provider from being treated as healthy when it cannot return usable candles.
- Add a reusable quality gate for historical data.
- Surface historical-data quality in Stock Intelligence without fabricating values.
- Add a diagnostics API for historical-data readiness.

This is a cumulative delta package. It does not replace earlier phases.
