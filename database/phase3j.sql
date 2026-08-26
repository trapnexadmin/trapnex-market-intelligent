create table if not exists stock_intelligence_runs (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  score numeric,
  confidence numeric not null default 0,
  factors jsonb not null default '[]'::jsonb,
  readiness jsonb not null default '{}'::jsonb,
  calculated_at timestamptz not null default now()
);

create index if not exists stock_intelligence_runs_symbol_time_idx
  on stock_intelligence_runs(symbol, calculated_at desc);
