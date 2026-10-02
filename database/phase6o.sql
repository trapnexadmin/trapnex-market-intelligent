create table if not exists market_candle_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  exchange text not null,
  instrument_token text,
  interval text not null,
  observed_at timestamptz not null,
  open numeric not null,
  high numeric not null,
  low numeric not null,
  close numeric not null,
  volume numeric,
  provider text not null,
  created_at timestamptz not null default now()
);

create index if not exists market_candles_symbol_interval_time_idx
  on market_candle_snapshots(symbol, interval, observed_at desc);

create table if not exists fundamental_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  as_of timestamptz,
  source text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists valuation_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  as_of timestamptz,
  source text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists stock_intelligence_complete_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  score numeric,
  confidence integer not null default 0,
  status text not null,
  factors jsonb not null default '[]'::jsonb,
  data_completeness jsonb not null default '{}'::jsonb,
  market_data_provider text,
  historical_provider text,
  calculated_at timestamptz not null
);

create index if not exists stock_intelligence_complete_symbol_time_idx
  on stock_intelligence_complete_snapshots(symbol, calculated_at desc);
