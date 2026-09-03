-- Weekly MICM fuel snapshot (5 consumer products + vigencia).
-- Safe if 0001 already created either the old or the new shape.

alter table public.fuel_prices add column if not exists effective_from date;
alter table public.fuel_prices add column if not exists effective_to date;
alter table public.fuel_prices add column if not exists gasoil_regular numeric(10, 2);
alter table public.fuel_prices add column if not exists gasoil_optimo numeric(10, 2) default 0;
alter table public.fuel_prices add column if not exists glp numeric(10, 2);
alter table public.fuel_prices add column if not exists source text default 'manual';
alter table public.fuel_prices add column if not exists source_url text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'fuel_prices'
      and column_name = 'date'
  ) then
    update public.fuel_prices
    set
      effective_from = coalesce(effective_from, date),
      effective_to = coalesce(effective_to, date + 6),
      gasoil_regular = coalesce(gasoil_regular, diesel, 0),
      glp = coalesce(glp, propane, 0),
      source = coalesce(source, 'manual');
  end if;
end $$;

create unique index if not exists fuel_prices_effective_from_key
  on public.fuel_prices (effective_from);
