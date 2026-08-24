create table if not exists market_cap_classification (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  segment text not null,
  rank integer,
  source text not null,
  effective_date date,
  source_updated_at timestamptz,
  created_at timestamptz not null default now(),
  unique(symbol, source, effective_date)
);

create index if not exists market_cap_classification_segment_idx
  on market_cap_classification(segment, rank);

create table if not exists market_cap_pulses (
  id uuid primary key default gen_random_uuid(),
  segment text not null,
  score numeric,
  direction text not null,
  change numeric,
  breadth numeric,
  momentum numeric,
  volume numeric,
  relative_strength numeric,
  confidence numeric not null default 0,
  total integer not null default 0,
  provider text,
  calculated_at timestamptz not null default now()
);

create index if not exists market_cap_pulses_lookup_idx
  on market_cap_pulses(segment, calculated_at desc);
