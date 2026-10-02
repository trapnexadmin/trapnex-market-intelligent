create table if not exists market_data_runs (
  run_id uuid primary key,
  provider text,
  requested integer not null default 0,
  received integer not null default 0,
  accepted integer not null default 0,
  rejected integer not null default 0,
  missing integer not null default 0,
  status text not null,
  started_at timestamptz not null,
  finished_at timestamptz not null,
  errors jsonb not null default '[]'::jsonb
);
create table if not exists market_quotes (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references market_data_runs(run_id),
  observed_at timestamptz not null,
  symbol text not null,
  exchange text not null,
  instrument_type text not null,
  instrument_token text,
  price numeric,
  previous_close numeric,
  open numeric,
  high numeric,
  low numeric,
  volume numeric,
  provider text not null
);
create index if not exists market_quotes_symbol_time_idx on market_quotes(symbol,observed_at desc);
create index if not exists market_quotes_provider_time_idx on market_quotes(provider,observed_at desc);
create index if not exists market_data_runs_time_idx on market_data_runs(started_at desc);
