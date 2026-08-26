create table if not exists provider_factor_observations (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  factor text not null,
  provider text not null,
  quality text not null,
  payload jsonb not null default '{}'::jsonb,
  source_timestamp timestamptz,
  fetched_at timestamptz not null default now()
);

create index if not exists provider_factor_observations_lookup_idx
  on provider_factor_observations(symbol, factor, provider, fetched_at desc);
