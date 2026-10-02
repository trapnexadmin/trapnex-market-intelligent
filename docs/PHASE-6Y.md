# Phase 6Y — Stock Intelligence Data Assembly & News Integration

Base: GitHub `main` at Phase 6X commit
`a88e616ae4022af3bc2097aef2e6471ca51b47a4`.

Focus:
- Assemble news/event risk into the complete Stock Intelligence engine.
- Use the existing events API logic as the canonical company-news source.
- Keep provider failures explicit and non-fatal.
- Feed verified news danger into the risk shield.
- Preserve null semantics when news is unavailable.
- Expose a single stock-intelligence detail endpoint combining score, data quality,
  market context, news/events, and technical plan inputs.

This phase does not add trading guarantees or predictions.
