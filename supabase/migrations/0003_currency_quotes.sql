-- Live/market snapshots for the currency tracker.
-- Kept separate from exchange_rates (BCRD buy/sell in the admin panel).

create table if not exists public.currency_quotes (
  id uuid primary key default gen_random_uuid(),
  usd_rate numeric(12, 4) not null check (usd_rate > 0),
  euro_rate numeric(12, 4) not null check (euro_rate > 0),
  gold_usd numeric(12, 2) not null check (gold_usd > 0),
  gold_rd numeric(12, 2) not null check (gold_rd > 0),
  date date not null,
  source text not null,
  created_at timestamptz not null default now()
);

create index if not exists currency_quotes_date_created_idx
  on public.currency_quotes (date desc, created_at desc);

alter table public.currency_quotes enable row level security;

create policy currency_quotes_public_read
  on public.currency_quotes
  for select
  using (true);
