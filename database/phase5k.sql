create table if not exists opportunity_technical_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  candle_count integer not null default 0,
  entry numeric,
  stop_loss numeric,
  target numeric,
  expected_return_pct numeric,
  downside_pct numeric,
  risk_reward numeric,
  provider text,
  as_of timestamptz,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists opportunity_technical_snapshots_symbol_time_idx
  on opportunity_technical_snapshots(symbol, created_at desc);
