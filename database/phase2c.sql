-- Phase 2C: multi-provider reconciliation and canonical snapshots.
create table if not exists market_data_observations (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  exchange text not null,
  provider text not null,
  instrument_type text not null,
  price numeric,
  previous_close numeric,
  open_price numeric,
  high_price numeric,
  low_price numeric,
  volume bigint,
  source_timestamp timestamptz,
  received_at timestamptz not null default now()
);
create index if not exists market_data_observations_symbol_time_idx
  on market_data_observations(exchange, symbol, received_at desc);

create table if not exists canonical_market_quotes (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  exchange text not null,
  price numeric,
  previous_close numeric,
  open_price numeric,
  high_price numeric,
  low_price numeric,
  volume bigint,
  source_count integer not null default 0,
  source_providers jsonb not null default '[]'::jsonb,
  confidence text not null,
  conflict boolean not null default false,
  max_price_deviation_percent numeric,
  source_timestamp timestamptz,
  calculated_at timestamptz not null default now()
);
create index if not exists canonical_market_quotes_lookup_idx
  on canonical_market_quotes(exchange, symbol, calculated_at desc);

create table if not exists canonical_market_indices (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  name text not null,
  value numeric,
  change_value numeric,
  change_percent numeric,
  source_count integer not null default 0,
  source_providers jsonb not null default '[]'::jsonb,
  confidence text not null,
  source_timestamp timestamptz,
  calculated_at timestamptz not null default now()
);
create index if not exists canonical_market_indices_lookup_idx
  on canonical_market_indices(name, calculated_at desc);
