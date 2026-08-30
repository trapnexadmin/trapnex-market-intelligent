create table if not exists opportunity_rankings (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  opportunity_score numeric,
  expected_return_pct numeric,
  downside_pct numeric,
  risk_reward numeric,
  decision text not null,
  confidence numeric not null default 0,
  reasons jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now()
);

create index if not exists opportunity_rankings_score_idx
  on opportunity_rankings(opportunity_score desc, generated_at desc);
