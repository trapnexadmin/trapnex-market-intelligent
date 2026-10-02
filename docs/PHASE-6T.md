# Phase 6T — Production Data Quality & Ranking Engine

Base: GitHub `main` at Phase 6S commit `8e845ae5b4cc1a2aca9ee46b17de95a7a1148c38`.

Focus:
- Correct cap-pulse propagation into batch Stock Intelligence.
- Remove the placeholder `RELIANCE` market-context dependency.
- Resolve unified market context from the actual requested universe.
- Preserve provider gaps as null/INSUFFICIENT_DATA.
- Add deterministic data-quality scoring and persistence.
- Keep ranking calculations based on real historical candles.

GitHub write note:
This package was prepared because the GitHub write connector may reject direct branch/ref mutations. The 6S commit itself is verified on `main`.
