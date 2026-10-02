-- Phase 6AG: persistent user portfolio holdings.
-- Additive migration; safe to run more than once.

create table if not exists public.portfolio_holdings (
  id uuid primary key default gen_random_uuid(),
  portfolio_key text not null,
  symbol text not null,
  exchange text not null default 'NSE',
  quantity numeric not null default 0,
  average_price numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(portfolio_key, symbol, exchange)
);

create index if not exists portfolio_holdings_key_idx
on public.portfolio_holdings(portfolio_key, updated_at desc);

create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  portfolio_key text not null,
  capital numeric not null,
  risk_profile text not null,
  allocation_plan jsonb not null default '{}'::jsonb,
  observed_at timestamptz not null default now()
);

create index if not exists portfolio_snapshots_key_time_idx
on public.portfolio_snapshots(portfolio_key, observed_at desc);