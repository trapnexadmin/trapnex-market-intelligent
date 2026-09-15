alter table if exists classification_snapshots
  add column if not exists as_of timestamptz not null default now();

create index if not exists classification_snapshots_symbol_asof_idx
on classification_snapshots(symbol, as_of desc);
