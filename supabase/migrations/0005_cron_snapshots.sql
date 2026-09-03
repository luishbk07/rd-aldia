-- Last-good snapshots written by Netlify scheduled functions.
-- Frontend reads these only through /api/* (service role), not from the functions.

create table if not exists public.cron_snapshots (
  key text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.cron_snapshots enable row level security;

create policy cron_snapshots_public_read
  on public.cron_snapshots
  for select
  using (true);
