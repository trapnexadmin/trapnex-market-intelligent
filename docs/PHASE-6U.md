# Phase 6U — Ranking Context Cache & Production Validation

Base: GitHub `main` at Phase 6T commit `cfb2342832303b4de9619450228b692469fe0c90`.

Scope:
- Avoid recalculating the same market snapshot for every ranked symbol.
- Compute unified pulses once from the current market observations and classifications.
- Resolve per-symbol cap and sector pulses from the shared pulse context.
- Keep missing classifications/pulses explicit.
- Add production validation endpoints for data-provider readiness.
- Do not fabricate live data or infer unavailable values.

GitHub note:
The Phase 6T base is verified on `main`. This package is the next cumulative delta; direct branch creation through the current GitHub connector returned HTTP 403 during preparation.
