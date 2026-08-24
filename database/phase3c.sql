create table if not exists stock_intelligence_readiness (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  live_quote boolean not null default false,
  technical boolean not null default false,
  fundamentals boolean not null default false,
  valuation boolean not null default false,
  institutional_flow boolean not null default false,
  sector_alignment boolean not null default false,
  news_event boolean not null default false,
  risk_trap_shield boolean not null default false,
  checked_at timestamptz not null default now()
);

create index if not exists stock_intelligence_readiness_symbol_time_idx
  on stock_intelligence_readiness(symbol, checked_at desc);
