# Phase 6R — Complete Stock Intelligence → Opportunity Ranking

Base: verified GitHub Phase 6Q commit `06f075012b7e94c4a96c4081ee65b6b6d3fd91a6`

## Scope
- Complete the Stock Intelligence integration contract.
- Pass market/cap/sector context into Stock Intelligence.
- Batch Stock Intelligence across the normalized NSE universe.
- Preserve `null` / `INSUFFICIENT_DATA`; never fabricate provider values.
- Persist factor snapshots and run summaries when Supabase is configured.
- Add full-universe Opportunity ranking APIs.
- Keep the existing Opportunity thresholds and risk/return model.

## Important
This is a cumulative **delta package**, not a full repository clone. Apply it on top of Phase 6Q.

The verified Phase 6Q base still has Angel One market quote methods returning empty arrays. Therefore 6R deliberately does not manufacture live quote values when the provider is unavailable.
