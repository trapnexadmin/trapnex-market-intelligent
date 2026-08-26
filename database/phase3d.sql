create table if not exists stock_factor_sources (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  factor text not null,
  provider text,
  quality text not null,
  source_timestamp timestamptz,
  fetched_at timestamptz not null default now(),
  raw_reference jsonb not null default '{}'::jsonb
);

create index if not exists stock_factor_sources_lookup_idx
  on stock_factor_sources(symbol, factor, fetched_at desc);
