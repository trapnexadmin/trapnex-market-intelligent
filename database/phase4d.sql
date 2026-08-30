create table if not exists market_news_events (
  id uuid primary key default gen_random_uuid(),
  external_id text,
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
  category text,
  rationale text,
  fetched_at timestamptz not null default now()
);

create index if not exists market_news_events_scope_time_idx
  on market_news_events(scope, published_at desc);

create table if not exists market_danger_signals (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  score numeric,
  level text not null,
  reasons jsonb not null default '[]'::jsonb,
  source_count integer not null default 0,
  calculated_at timestamptz not null default now()
);

create index if not exists market_danger_signals_scope_time_idx
  on market_danger_signals(scope, calculated_at desc);
