-- Articles for the admin editor and public site.
-- 0001 already created a slimmer articles table; this makes the full shape
-- and is safe to paste in the Supabase SQL editor on a new project.

create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  excerpt text,
  cover_image text,
  content text,
  author text,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles add column if not exists excerpt text;
alter table public.articles add column if not exists cover_image text;
alter table public.articles add column if not exists content text;
alter table public.articles add column if not exists author text;
alter table public.articles add column if not exists published_at timestamptz;
alter table public.articles add column if not exists created_at timestamptz not null default now();
alter table public.articles add column if not exists updated_at timestamptz not null default now();

alter table public.articles
  alter column published_at set default now();

create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

create index if not exists articles_category_idx
  on public.articles (category);

alter table public.articles enable row level security;

drop policy if exists articles_public_read on public.articles;
create policy articles_public_read
  on public.articles
  for select
  to anon, authenticated
  using (true);

-- service_role already bypasses RLS; this documents admin writes via the
-- SUPABASE_SERVICE_ROLE_KEY used by /api/admin/*.
drop policy if exists articles_admin_write on public.articles;
create policy articles_admin_write
  on public.articles
  for all
  to service_role
  using (true)
  with check (true);
