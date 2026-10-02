# Phase 6AE — Portfolio Concentration Guardrails

Base: Phase 6AD commit `89697d5675d65600b094e6bd49539fbcd673536d`.

Adds a sector concentration guardrail on top of the existing allocation engine.

- Per-sector allocation is capped at 30%.
- Existing per-stock limits and large/mid/small-cap limits remain unchanged.
- When constraints prevent full deployment, the plan reports unallocated capital.
- No missing model factor is converted into a synthetic value.

This is a portfolio construction utility, not a guarantee of investment returns.