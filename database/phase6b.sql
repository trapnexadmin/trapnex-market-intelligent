create table if not exists instrument_classifications(
 id uuid primary key default gen_random_uuid(), symbol text not null,
 exchange text not null check(exchange in ('NSE','BSE')),
 cap_bucket text check(cap_bucket in ('LARGE','MID','SMALL')),
 sector text, source text not null, effective_date date,
 as_of timestamptz not null default now(), unique(symbol,exchange)
);
create index if not exists instrument_classifications_cap_idx on instrument_classifications(cap_bucket);
create index if not exists instrument_classifications_sector_idx on instrument_classifications(sector);