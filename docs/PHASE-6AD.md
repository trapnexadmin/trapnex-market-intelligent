# Phase 6AD — Portfolio Allocation Engine

Base: Phase 6AC commit `a563a26b761de52905db0318e3d045957dc54450`.

Adds a deterministic portfolio-allocation layer over the existing opportunity ranking pipeline.

- Default capital: INR 1,000,000 when omitted.
- Risk profiles: CONSERVATIVE, BALANCED, GROWTH.
- Balanced cap limits: LARGE 60%, MID 30%, SMALL 15%.
- Per-stock limits: 5% minimum, 20% maximum, maximum 15 stocks.
- Uses existing opportunity score, confidence, risk shield, liquidity score and expected-return component.
- Missing values remain missing; no synthetic factor values are created.
- Allocation rows retain model context and reasons.

This is a model-based allocation utility, not a guarantee of returns.