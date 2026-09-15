create table if not exists unified_pulse_snapshots(
  id uuid primary key default gen_random_uuid(),
  pulse_date timestamptz not null default now(),
  nifty_score numeric,
  large_cap_score numeric,
  mid_cap_score numeric,
  small_cap_score numeric,
  sector_scores jsonb not null default '{}'::jsonb,
  classification_count integer not null default 0,
  provider text
);

create index if not exists unified_pulse_snapshots_time_idx
on unified_pulse_snapshots(pulse_date desc);
