create extension if not exists pgcrypto;

create table if not exists public.fuel_prices (
  id uuid primary key default gen_random_uuid(),
  effective_from date not null unique,
  effective_to date not null,
  gasoline_premium numeric(10, 2) not null default 0,
  gasoline_regular numeric(10, 2) not null default 0,
  gasoil_regular numeric(10, 2) not null default 0,
  gasoil_optimo numeric(10, 2) not null default 0,
  glp numeric(10, 2) not null default 0,
  source text not null default 'manual' check (source in ('manual', 'scrape')),
  source_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  usd_buy numeric(10, 2) not null check (usd_buy > 0),
  usd_sell numeric(10, 2) not null check (usd_sell > 0),
  euro_buy numeric(10, 2) not null check (euro_buy > 0),
  euro_sell numeric(10, 2) not null check (euro_sell > 0),
  gold_price numeric(10, 2) not null check (gold_price > 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.sports_results (
  id uuid primary key default gen_random_uuid(),
  league text not null check (league in ('LIDOM', 'MLB')),
  home_team text not null,
  away_team text not null,
  home_score integer not null default 0 check (home_score >= 0),
  away_score integer not null default 0 check (away_score >= 0),
  played_at timestamptz not null,
  status text not null check (status in ('scheduled', 'live', 'final', 'postponed', 'canceled')),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  excerpt text not null default '',
  content text not null default '',
  featured boolean not null default false,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles (id) on delete cascade,
  author_name text not null,
  body text not null,
  approved boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fuel_prices enable row level security;
alter table public.exchange_rates enable row level security;
alter table public.sports_results enable row level security;
alter table public.articles enable row level security;
alter table public.comments enable row level security;

-- Public reads for published site data; writes only via service role (admin API).
create policy fuel_prices_public_read on public.fuel_prices for select using (true);
create policy exchange_rates_public_read on public.exchange_rates for select using (true);
create policy sports_results_public_read on public.sports_results for select using (true);
create policy articles_public_read on public.articles for select using (true);
create policy comments_public_read on public.comments for select using (approved = true);
