create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  score numeric,
  expected_return_pct numeric,
  downside_pct numeric,
  risk_reward numeric,
  decision text not null,
  confidence numeric not null default 0,
  reasons jsonb not null default '[]'::jsonb,
  calculated_at timestamptz not null default now()
);

create index if not exists opportunities_symbol_time_idx
  on opportunities(symbol, calculated_at desc);
