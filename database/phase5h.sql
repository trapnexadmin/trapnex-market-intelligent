create table if not exists opportunity_provider_snapshots(
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  provider text not null,
  price numeric,
  change_pct numeric,
  volume numeric,
  as_of timestamptz,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists opportunity_provider_snapshots_symbol_time_idx
on opportunity_provider_snapshots(symbol,created_at desc);
