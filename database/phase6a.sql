create table if not exists market_pulse_snapshots(
  id uuid primary key default gen_random_uuid(),
  pulse_type text not null,
  segment text,
  score numeric,
  direction text,
  sample_size integer not null default 0,
  source text,
  calculated_at timestamptz not null default now()
);
create index if not exists market_pulse_snapshots_type_time_idx
on market_pulse_snapshots(pulse_type,calculated_at desc);
