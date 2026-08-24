create table if not exists market_breadth_calculations (
  id uuid primary key default gen_random_uuid(),
  market text not null,
  total integer not null,
  advancers integer not null,
  decliners integer not null,
  unchanged integer not null,
  advance_decline_ratio numeric,
  above20dma_percent numeric,
  above50dma_percent numeric,
  above200dma_percent numeric,
  volume_advancing_percent numeric,
  breadth_thrust numeric,
  score numeric,
  confidence numeric not null default 0,
  coverage jsonb not null default '{}'::jsonb,
  status text not null,
  provider text,
  calculated_at timestamptz not null default now()
);

create index if not exists market_breadth_calculations_market_time_idx
  on market_breadth_calculations(market, calculated_at desc);
