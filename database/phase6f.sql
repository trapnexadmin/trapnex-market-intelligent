create table if not exists classification_snapshots(
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  exchange text not null,
  cap_bucket text,
  sector text,
  source text not null,
  effective_date date,
  as_of timestamptz not null default now()
);

create index if not exists classification_snapshots_symbol_idx
on classification_snapshots(symbol);

create index if not exists classification_snapshots_effective_idx
on classification_snapshots(effective_date desc);
