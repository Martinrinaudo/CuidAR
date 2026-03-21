-- RLS for domestic forms scoped by authenticated user + admin visibility.

begin;

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.active = true
      and lower(au.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_admin_user() to anon, authenticated;

alter table public."SolicitudesEmpleadaDomestica"
  add column if not exists "user_id" uuid references auth.users(id) on delete cascade,
  add column if not exists "created_at" timestamptz not null default now();

alter table public."RegistrosEmpleadasDomesticas"
  add column if not exists "user_id" uuid references auth.users(id) on delete cascade,
  add column if not exists "created_at" timestamptz not null default now();

alter table public."SolicitudesEmpleadaDomestica" enable row level security;
alter table public."RegistrosEmpleadasDomesticas" enable row level security;

grant select, insert, update, delete on public."SolicitudesEmpleadaDomestica" to authenticated;
grant select, insert, update, delete on public."RegistrosEmpleadasDomesticas" to authenticated;

-- SolicitudesEmpleadaDomestica: own rows only for regular users.
drop policy if exists "solicitudes_insert_own" on public."SolicitudesEmpleadaDomestica";
create policy "solicitudes_insert_own"
on public."SolicitudesEmpleadaDomestica"
for insert
to authenticated
with check (
  auth.uid() is not null
  and "user_id" = auth.uid()
);

drop policy if exists "solicitudes_select_own" on public."SolicitudesEmpleadaDomestica";
create policy "solicitudes_select_own"
on public."SolicitudesEmpleadaDomestica"
for select
to authenticated
using (
  auth.uid() is not null
  and "user_id" = auth.uid()
);

drop policy if exists "solicitudes_update_own" on public."SolicitudesEmpleadaDomestica";
create policy "solicitudes_update_own"
on public."SolicitudesEmpleadaDomestica"
for update
to authenticated
using (
  auth.uid() is not null
  and "user_id" = auth.uid()
)
with check (
  auth.uid() is not null
  and "user_id" = auth.uid()
);

drop policy if exists "solicitudes_delete_own" on public."SolicitudesEmpleadaDomestica";
create policy "solicitudes_delete_own"
on public."SolicitudesEmpleadaDomestica"
for delete
to authenticated
using (
  auth.uid() is not null
  and "user_id" = auth.uid()
);

-- Admin can read all solicitudes for panel visibility.
drop policy if exists "solicitudes_select_admin" on public."SolicitudesEmpleadaDomestica";
create policy "solicitudes_select_admin"
on public."SolicitudesEmpleadaDomestica"
for select
to authenticated
using (public.is_admin_user());

-- RegistrosEmpleadasDomesticas: own rows for users + full read for admin.
drop policy if exists "registros_insert_own" on public."RegistrosEmpleadasDomesticas";
create policy "registros_insert_own"
on public."RegistrosEmpleadasDomesticas"
for insert
to authenticated
with check (
  auth.uid() is not null
  and "user_id" = auth.uid()
);

drop policy if exists "registros_select_own_or_admin" on public."RegistrosEmpleadasDomesticas";
create policy "registros_select_own_or_admin"
on public."RegistrosEmpleadasDomesticas"
for select
to authenticated
using (
  auth.uid() is not null
  and (
    "user_id" = auth.uid()
    or public.is_admin_user()
  )
);

drop policy if exists "registros_update_own" on public."RegistrosEmpleadasDomesticas";
create policy "registros_update_own"
on public."RegistrosEmpleadasDomesticas"
for update
to authenticated
using (
  auth.uid() is not null
  and "user_id" = auth.uid()
)
with check (
  auth.uid() is not null
  and "user_id" = auth.uid()
);

drop policy if exists "registros_delete_own" on public."RegistrosEmpleadasDomesticas";
create policy "registros_delete_own"
on public."RegistrosEmpleadasDomesticas"
for delete
to authenticated
using (
  auth.uid() is not null
  and "user_id" = auth.uid()
);

create index if not exists idx_solicitudes_domestica_user_id
  on public."SolicitudesEmpleadaDomestica" ("user_id");

create index if not exists idx_solicitudes_domestica_user_fecha
  on public."SolicitudesEmpleadaDomestica" ("user_id", "FechaEnvio" desc);

create index if not exists idx_registros_domesticas_user_id
  on public."RegistrosEmpleadasDomesticas" ("user_id");

create index if not exists idx_registros_domesticas_user_fecha
  on public."RegistrosEmpleadasDomesticas" ("user_id", "FechaEnvio" desc);

commit;
