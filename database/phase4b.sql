create table if not exists scored_news_events (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  symbol text,
  scope text not null,
  provider text not null,
  headline text not null,
  summary text,
  url text,
  published_at timestamptz,
  sentiment numeric,
  materiality numeric,
  impact numeric,
  news_score numeric,
  risk_score numeric,
  quality text not null,
  reasons jsonb not null default '[]'::jsonb,
  calculated_at timestamptz not null default now()
);

create index if not exists scored_news_events_symbol_time_idx
  on scored_news_events(symbol, published_at desc);

create table if not exists danger_signal_history (
  id uuid primary key default gen_random_uuid(),
  symbol text,
  scope text not null,
  score numeric,
  level text not null,
  source_count integer not null default 0,
  reasons jsonb not null default '[]'::jsonb,
  calculated_at timestamptz not null default now()
);

create index if not exists danger_signal_history_symbol_time_idx
  on danger_signal_history(symbol, calculated_at desc);
