# TRAPNEX Phase 2C

## Multi-provider market ingestion and reconciliation

### Implemented
- IndianAPI documented `/indices` integration.
- IndianAPI NSE batch live-price integration.
- Canonical quote reconciliation.
- Canonical index reconciliation.
- Provider/source count.
- Source provenance.
- Confidence level.
- Price conflict detection.
- Aggregate market endpoint.
- Canonical PostgreSQL/Supabase tables.

### Reconciliation rules
- Angel One is preferred when it is present for the same instrument.
- Median price is used for the canonical observation.
- More than one valid source increases confidence.
- Price deviation above 0.25% is marked as a conflict.
- No provider data means `INSUFFICIENT_DATA`; no synthetic values are generated.

### Important data-source policy
NSE public web pages can be used for reference/validation, but official real-time NSE market-data distribution is subject to NSE Data & Analytics licensing and usage policies. TRAPNEX therefore does not pretend that scraping the public NSE site is an official real-time feed.

IndianAPI currently documents `/indices`, `/nse_stock_batch_live_price`, `/bse_stock_batch_live_price`, `/trending`, and historical-data endpoints. These are used according to their documented contracts.

### Next
Phase 2D: calculate market breadth from the normalized stock universe:
- Advancers / Decliners / Unchanged
- % above 20 DMA
- % above 50 DMA
- % above 200 DMA
- volume breadth
- breadth thrust
