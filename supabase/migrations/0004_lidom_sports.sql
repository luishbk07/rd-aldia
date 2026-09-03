-- LIDOM + Dominican MLB snapshots. Keep sports_results for the older generic editor.

create table if not exists public.lidom_results (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  home_team text not null,
  away_team text not null,
  home_score integer not null default 0 check (home_score >= 0),
  away_score integer not null default 0 check (away_score >= 0),
  stadium text not null default '',
  status text not null check (status in ('scheduled', 'live', 'final', 'postponed', 'canceled')),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists lidom_results_date_idx on public.lidom_results (date desc);

create table if not exists public.lidom_standings (
  id uuid primary key default gen_random_uuid(),
  team text not null,
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  pct numeric(4, 3) not null default 0,
  games_back numeric(4, 1) not null default 0,
  season text not null,
  updated_at timestamptz not null default now(),
  unique (season, team)
);

create table if not exists public.lidom_spotlight (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  team text not null,
  note text not null default '',
  week_of date,
  updated_at timestamptz not null default now()
);

create table if not exists public.mlb_dominicans (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  team text not null,
  avg text not null,
  home_runs integer not null default 0,
  rbi integer not null default 0,
  ops text not null,
  season integer not null,
  updated_at timestamptz not null default now(),
  unique (player_name, season)
);

alter table public.lidom_results enable row level security;
alter table public.lidom_standings enable row level security;
alter table public.lidom_spotlight enable row level security;
alter table public.mlb_dominicans enable row level security;

create policy lidom_results_public_read on public.lidom_results for select using (true);
create policy lidom_standings_public_read on public.lidom_standings for select using (true);
create policy lidom_spotlight_public_read on public.lidom_spotlight for select using (true);
create policy mlb_dominicans_public_read on public.mlb_dominicans for select using (true);
