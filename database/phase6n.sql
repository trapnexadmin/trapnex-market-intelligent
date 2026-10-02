create table if not exists stock_intelligence_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  score numeric,
  confidence integer not null default 0,
  status text not null,
  factors jsonb not null default '[]'::jsonb,
  provider text,
  calculated_at timestamptz not null
);
create index if not exists stock_intelligence_symbol_time_idx on stock_intelligence_snapshots(symbol, calculated_at desc);
