create table if not exists stock_intelligence_scores (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  score numeric,
  confidence numeric not null default 0,
  status text not null,
  factors jsonb not null default '[]'::jsonb,
  methodology_version text not null default '3A.1',
  calculated_at timestamptz not null default now()
);

create index if not exists stock_intelligence_scores_symbol_time_idx
  on stock_intelligence_scores(symbol, calculated_at desc);
