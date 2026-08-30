create table if not exists opportunity_context_snapshots(
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  stock_score numeric,
  stock_confidence numeric not null default 0,
  market_pulse numeric,
  sector_pulse numeric,
  risk_shield numeric,
  liquidity_score numeric,
  expected_return_pct numeric,
  downside_pct numeric,
  created_at timestamptz not null default now()
);

create index if not exists opportunity_context_snapshots_symbol_time_idx
  on opportunity_context_snapshots(symbol,created_at desc);
