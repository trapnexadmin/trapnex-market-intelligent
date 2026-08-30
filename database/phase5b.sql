create table if not exists opportunity_trade_plans (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  entry numeric,
  stop_loss numeric,
  target numeric,
  upside_pct numeric,
  downside_pct numeric,
  risk_reward numeric,
  valid boolean not null default false,
  calculated_at timestamptz not null default now()
);

create index if not exists opportunity_trade_plans_symbol_time_idx
  on opportunity_trade_plans(symbol, calculated_at desc);
