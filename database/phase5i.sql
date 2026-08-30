create table if not exists opportunity_provider_runs (
  id uuid primary key default gen_random_uuid(),
  symbol_count integer not null,
  candidate_count integer not null default 0,
  status text not null,
  provider_status jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists opportunity_provider_runs_time_idx
  on opportunity_provider_runs(started_at desc);
