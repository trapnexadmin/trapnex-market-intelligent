create table if not exists opportunity_rank_snapshots(
  id uuid primary key default gen_random_uuid(),
  snapshot_at timestamptz not null default now(),
  symbol text not null,
  score numeric,
  decision text not null,
  completeness_pct integer not null default 0,
  market_pulse numeric,
  sector_pulse numeric,
  expected_return_pct numeric,
  risk_reward numeric
);

create index if not exists opportunity_rank_snapshots_time_idx
on opportunity_rank_snapshots(snapshot_at desc);

create index if not exists opportunity_rank_snapshots_symbol_idx
on opportunity_rank_snapshots(symbol, snapshot_at desc);
