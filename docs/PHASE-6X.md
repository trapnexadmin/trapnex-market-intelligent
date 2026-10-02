# Phase 6X — End-to-End Provider Readiness & Diagnostics

Base: GitHub `main` at Phase 6W commit
`e34a3a3ecfb0a7bd95023204b3f1f45f09436`.

Focus:
- Combine market, historical, fundamentals, and institutional health into one diagnostics contract.
- Keep `NOT_CONFIGURED`, `ERROR`, and `READY` distinct.
- Add explicit endpoint validation for Stock Intelligence dependencies.
- Prevent diagnostics from reporting READY merely because one unrelated provider is healthy.
- Preserve existing scoring and ranking behavior.

This is a cumulative delta package. No existing phase is removed.
