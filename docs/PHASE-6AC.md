# Phase 6AC — Opportunity Explainability Hardening

Base: GitHub `main` at Phase 6AB commit `515cdd3178e701f4c47eb108acf87b561f55238a`.

## Changes

- Opportunity reasons now explicitly include the liquidity score when available.
- When liquidity is unavailable, the reason states that no synthetic liquidity value was used.
- This makes the scoring response auditable when liquidity is missing instead of silently omitting the factor.

## Current GitHub status

The repository currently contains the Phase 6AB commit. A direct write attempt for 6AC returned HTTP 403 (`Resource not accessible by integration`), so this package is the authoritative 6AC patch against commit `515cdd3178e701f4c47eb108acf87b561f55238a`.

No GitHub commit is claimed for Phase 6AC.
