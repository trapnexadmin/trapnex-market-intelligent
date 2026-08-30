create table if not exists classification_refresh_runs(
 id uuid primary key default gen_random_uuid(),
 source text not null,
 effective_date date,
 accepted_count integer not null default 0,
 rejected_count integer not null default 0,
 status text not null,
 errors jsonb not null default '[]'::jsonb,
 created_at timestamptz not null default now()
);

create table if not exists instrument_classifications(
 id uuid primary key default gen_random_uuid(),
 symbol text not null,
 exchange text not null check(exchange in ('NSE','BSE')),
 cap_bucket text check(cap_bucket in ('LARGE','MID','SMALL')),
 sector text,
 source text not null,
 effective_date date,
 as_of timestamptz not null default now(),
 unique(symbol,exchange)
);

create index if not exists instrument_classifications_effective_idx
on instrument_classifications(effective_date desc);
