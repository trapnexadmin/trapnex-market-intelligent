create table if not exists sector_classification (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  sector text not null,
  industry text,
  source text not null,
  effective_date date,
  created_at timestamptz not null default now(),
  unique(symbol, source, effective_date)
);

create index if not exists sector_classification_sector_idx
  on sector_classification(sector, symbol);

create table if not exists sector_pulses (
  id uuid primary key default gen_random_uuid(),
  sector text not null,
  score numeric,
  direction text not null,
  breadth numeric,
  momentum numeric,
  volume numeric,
  relative_strength numeric,
  news numeric,
  earnings numeric,
  confidence numeric not null default 0,
  total integer not null default 0,
  provider text,
  calculated_at timestamptz not null default now()
);

create index if not exists sector_pulses_lookup_idx
  on sector_pulses(sector, calculated_at desc);
