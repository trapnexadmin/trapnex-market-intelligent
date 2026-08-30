create table if not exists news_source_evidence (
  id uuid primary key default gen_random_uuid(),
  event_key text not null,
  provider text not null,
  reliability numeric not null,
  published_at timestamptz,
  score numeric,
  payload jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now()
);

create index if not exists news_source_evidence_event_time_idx
  on news_source_evidence(event_key, fetched_at desc);

create table if not exists risk_trap_shield_history (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  shield_score numeric,
  danger_score numeric,
  leverage_risk numeric,
  governance_risk numeric,
  liquidity_risk numeric,
  abnormal_price_volume numeric,
  calculated_at timestamptz not null default now()
);

create index if not exists risk_trap_shield_symbol_time_idx
  on risk_trap_shield_history(symbol, calculated_at desc);
