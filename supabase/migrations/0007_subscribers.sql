-- Newsletter list. Emails are private: no public SELECT.
-- Inserts go through /api/newsletter with the service role key.

create extension if not exists pgcrypto;

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint subscribers_email_unique unique (email)
);

create index if not exists subscribers_created_at_idx
  on public.subscribers (created_at desc);

alter table public.subscribers enable row level security;

drop policy if exists subscribers_public_read on public.subscribers;
drop policy if exists subscribers_admin_write on public.subscribers;

create policy subscribers_admin_write
  on public.subscribers
  for all
  to service_role
  using (true)
  with check (true);
