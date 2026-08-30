create table if not exists news_ai_classifications (
  id uuid primary key default gen_random_uuid(),
  symbol text,
  provider text not null,
  external_event_id text,
  sentiment numeric,
  materiality numeric,
  market_impact numeric,
  risk_score numeric,
  category text,
  rationale text,
  classified_at timestamptz not null default now()
);

create index if not exists news_ai_classifications_symbol_time_idx
  on news_ai_classifications(symbol, classified_at desc);
