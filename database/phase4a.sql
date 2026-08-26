create table if not exists news_events (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  scope text not null,
  symbol text,
  sector text,
  provider text not null,
  headline text not null,
  summary text,
  url text,
  published_at timestamptz,
  sentiment numeric,
  materiality numeric,
  impact numeric,
  quality text not null,
  fetched_at timestamptz not null default now()
);

create index if not exists news_events_symbol_time_idx
  on news_events(symbol, published_at desc);

create table if not exists danger_signals (
  id uuid primary key default gen_random_uuid(),
  symbol text,
  scope text not null,
  score numeric,
  level text not null,
  reasons jsonb not null default '[]'::jsonb,
  source_count integer not null default 0,
  calculated_at timestamptz not null default now()
);

create index if not exists danger_signals_symbol_time_idx
  on danger_signals(symbol, calculated_at desc);
