create extension if not exists pgcrypto;

create table if not exists provider_health (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  status text not null,
  latency_ms integer,
  capabilities jsonb not null default '[]'::jsonb,
  last_successful_at timestamptz,
  message text,
  checked_at timestamptz not null default now()
);
create index if not exists provider_health_latest_idx on provider_health(provider, checked_at desc);

create table if not exists instruments (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  exchange text not null,
  instrument_token text,
  instrument_type text not null,
  company_name text,
  sector text,
  market_cap_bucket text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(symbol, exchange)
);

create table if not exists market_quotes (
  id uuid primary key default gen_random_uuid(),
  instrument_id uuid references instruments(id),
  symbol text not null,
  exchange text not null,
  provider text not null,
  price numeric,
  previous_close numeric,
  open_price numeric,
  high_price numeric,
  low_price numeric,
  volume bigint,
  source_timestamp timestamptz,
  received_at timestamptz not null default now()
);
create index if not exists market_quotes_lookup_idx on market_quotes(symbol, exchange, source_timestamp desc);

create table if not exists market_index_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  name text not null,
  provider text not null,
  value numeric,
  previous_close numeric,
  change_value numeric,
  change_percent numeric,
  source_timestamp timestamptz,
  received_at timestamptz not null default now()
);
create index if not exists market_index_snapshots_lookup_idx on market_index_snapshots(symbol, source_timestamp desc);

create table if not exists market_breadth_snapshots (
  id uuid primary key default gen_random_uuid(),
  market text not null,
  provider text not null,
  advancers integer,
  decliners integer,
  unchanged integer,
  total integer,
  above20dma numeric,
  above50dma numeric,
  above200dma numeric,
  source_timestamp timestamptz,
  received_at timestamptz not null default now()
);
