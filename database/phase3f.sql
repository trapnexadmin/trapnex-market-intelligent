create table if not exists stock_historical_candles (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  exchange text not null,
  interval text not null,
  open_price numeric not null,
  high_price numeric not null,
  low_price numeric not null,
  close_price numeric not null,
  volume bigint,
  source_timestamp timestamptz not null,
  provider text not null,
  received_at timestamptz not null default now()
);

create index if not exists stock_historical_candles_lookup_idx
  on stock_historical_candles(symbol, interval, source_timestamp desc);

create table if not exists stock_news_events (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  provider text not null,
  headline text not null,
  url text,
  published_at timestamptz,
  sentiment_score numeric,
  impact_score numeric,
  payload jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now()
);

create index if not exists stock_news_events_lookup_idx
  on stock_news_events(symbol, published_at desc);
