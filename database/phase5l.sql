create table if not exists final_opportunity_snapshots(
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  score numeric,
  confidence numeric not null default 0,
  expected_return_pct numeric,
  downside_pct numeric,
  risk_reward numeric,
  decision text not null,
  entry numeric,
  stop_loss numeric,
  target numeric,
  sources jsonb not null default '[]'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists final_opportunity_snapshots_score_idx
on final_opportunity_snapshots(score desc,created_at desc);
