create table if not exists equity_universe_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_at timestamptz not null default now(),
  symbol text not null,
  exchange text not null,
  provider_symbol text not null,
  company_name text not null,
  isin text,
  cap_bucket text,
  sector text,
  industry text,
  active boolean not null default true,
  listed boolean not null default true,
  source text not null,
  effective_date date,
  as_of timestamptz not null default now()
);

create index if not exists equity_universe_symbol_idx
  on equity_universe_snapshots(exchange, symbol, snapshot_at desc);

create index if not exists equity_universe_active_idx
  on equity_universe_snapshots(active, listed);

create index if not exists equity_universe_cap_sector_idx
  on equity_universe_snapshots(cap_bucket, sector);
