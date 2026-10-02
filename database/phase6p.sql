create table if not exists institutional_flow_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  as_of timestamptz,
  source text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists institutional_flow_symbol_time_idx
  on institutional_flow_snapshots(symbol, created_at desc);

create table if not exists stock_intelligence_factor_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  factor_key text not null,
  score numeric,
  status text not null,
  source text,
  observed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists stock_intelligence_factor_symbol_time_idx
  on stock_intelligence_factor_snapshots(symbol, created_at desc);
