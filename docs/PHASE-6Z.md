# Phase 6Z — Market-Wide News Intelligence

Base: GitHub `main` at Phase 6X commit
`a88e616ae4022af3bc2097aef2e6471ca51b47a4`.

Goals:
- Add a market-wide news context separate from per-stock news.
- Track India/systemic and global/systemic danger signals.
- Keep source/provenance and event timestamps explicit.
- Do not let missing news silently become a positive/negative score.
- Feed the market-wide context into Opportunity/Stock Intelligence only when data is available.

Provider note:
The repository already has company news through Finnhub/AI. This phase introduces
a generic market-news provider boundary so a production source can be plugged in
without hard-coding unverified fields.
