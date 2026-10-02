create table if not exists institutional_flow_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  as_of timestamptz,
  source text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists institutional_flow_symbol_time_idx
  on institutional_flow_snapshots(symbol, created_at desc);

create table if not exists corporate_action_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  action_type text not null,
  purpose text not null,
  ex_date date,
  record_date date,
  announcement_date date,
  source text not null,
  url text,
  observed_at timestamptz not null default now()
);

create index if not exists corporate_action_symbol_time_idx
  on corporate_action_snapshots(symbol, observed_at desc);

create table if not exists news_event_snapshots (
  id uuid primary key default gen_random_uuid(),
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
  reasons jsonb not null default '[]'::jsonb,
  observed_at timestamptz not null default now()
);

create index if not exists news_event_symbol_time_idx
  on news_event_snapshots(symbol, observed_at desc);
