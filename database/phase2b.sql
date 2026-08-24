-- Phase 2B: Angel One instrument master + quote snapshots.
-- Run after phase2a.sql.

create table if not exists angel_instruments (
  id uuid primary key default gen_random_uuid(),
  token text not null,
  symbol text not null,
  name text,
  expiry text,
  strike numeric,
  lot_size integer,
  instrument_type text,
  exchange_segment text not null,
  tick_size numeric,
  is_fno boolean not null default false,
  source text not null default 'ANGEL_ONE',
  source_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(exchange_segment, token)
);

create index if not exists angel_instruments_symbol_idx
  on angel_instruments(symbol);

create index if not exists angel_instruments_exchange_symbol_idx
  on angel_instruments(exchange_segment, symbol);

create table if not exists angel_live_ticks (
  id bigint generated always as identity primary key,
  exchange_type integer not null,
  token text not null,
  mode integer not null,
  last_traded_price numeric,
  sequence_number bigint,
  exchange_timestamp timestamptz,
  received_at timestamptz not null default now()
);

create index if not exists angel_live_ticks_token_time_idx
  on angel_live_ticks(token, received_at desc);

create table if not exists angel_quote_snapshots (
  id uuid primary key default gen_random_uuid(),
  token text not null,
  exchange text not null,
  trading_symbol text not null,
  ltp numeric,
  open_price numeric,
  high_price numeric,
  low_price numeric,
  previous_close numeric,
  volume bigint,
  provider text not null default 'ANGEL_ONE',
  source_timestamp timestamptz,
  received_at timestamptz not null default now()
);

create index if not exists angel_quote_snapshots_symbol_time_idx
  on angel_quote_snapshots(trading_symbol, received_at desc);
