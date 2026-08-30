create table if not exists opportunity_provider_runs (
  id uuid primary key default gen_random_uuid(),
  symbol_count integer not null,
  candidate_count integer not null default 0,
  status text not null,
  provider_status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists opportunity_provider_quotes (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  provider text not null,
  price numeric,
  change_pct numeric,
  volume numeric,
  as_of timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists opportunity_provider_quotes_symbol_time_idx
  on opportunity_provider_quotes(symbol, created_at desc);
