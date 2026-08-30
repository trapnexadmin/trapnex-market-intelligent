create table if not exists opportunity_provider_context(
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  stock_score numeric,
  stock_confidence numeric not null default 0,
  market_pulse numeric,
  sector_pulse numeric,
  risk_shield numeric,
  liquidity_score numeric,
  entry numeric,
  target numeric,
  stop_loss numeric,
  expected_return_pct numeric,
  downside_pct numeric,
  risk_reward numeric,
  sources jsonb not null default '[]'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists opportunity_provider_context_symbol_time_idx
on opportunity_provider_context(symbol,created_at desc);
