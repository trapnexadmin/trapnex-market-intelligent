create table if not exists stock_factor_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  factor text not null,
  score numeric,
  raw_inputs jsonb not null default '{}'::jsonb,
  provider text,
  methodology_version text not null default '3B.1',
  observed_at timestamptz not null default now()
);

create index if not exists stock_factor_snapshots_symbol_factor_time_idx
  on stock_factor_snapshots(symbol, factor, observed_at desc);
