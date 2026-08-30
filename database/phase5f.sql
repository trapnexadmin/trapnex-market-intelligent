create table if not exists opportunity_universe_runs(
  id uuid primary key default gen_random_uuid(),
  universe_size integer not null,
  candidate_count integer not null default 0,
  status text not null,
  generated_at timestamptz not null default now()
);

create table if not exists opportunity_rankings(
  id uuid primary key default gen_random_uuid(),
  run_id uuid references opportunity_universe_runs(id) on delete set null,
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

create index if not exists opportunity_rankings_run_score_idx
  on opportunity_rankings(run_id,opportunity_score desc);
