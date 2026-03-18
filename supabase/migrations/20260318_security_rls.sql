-- Security hardening: RLS + admin access model for CuidAR tables.
-- Apply with: supabase db push (or psql against your production DB).

begin;

-- 1) Admin users registry
create table if not exists public.admin_users (
  email text primary key,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2) Helper function for policies
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

-- 3) Enable RLS on all business tables
alter table public."RegistrosCuidadores" enable row level security;
alter table public."RegistrosTransportistas" enable row level security;
alter table public."SolicitudesCuidado" enable row level security;
alter table public."SolicitudesTraslado" enable row level security;

-- 4) Public insert policies for forms
-- Edge function formularios runs with anon key; inserts must be explicitly allowed.
drop policy if exists "anon_insert_cuidadores" on public."RegistrosCuidadores";
create policy "anon_insert_cuidadores"
on public."RegistrosCuidadores"
for insert
to anon
with check (true);

drop policy if exists "anon_insert_transportistas" on public."RegistrosTransportistas";
create policy "anon_insert_transportistas"
on public."RegistrosTransportistas"
for insert
to anon
with check (true);

drop policy if exists "anon_insert_solicitudes_cuidado" on public."SolicitudesCuidado";
create policy "anon_insert_solicitudes_cuidado"
on public."SolicitudesCuidado"
for insert
to anon
with check (true);

drop policy if exists "anon_insert_solicitudes_traslado" on public."SolicitudesTraslado";
create policy "anon_insert_solicitudes_traslado"
on public."SolicitudesTraslado"
for insert
to anon
with check (true);

-- 5) Authenticated admin policies for read/update/delete
-- Admin Edge function forwards user token and must satisfy these policies.

drop policy if exists "admin_select_cuidadores" on public."RegistrosCuidadores";
create policy "admin_select_cuidadores"
on public."RegistrosCuidadores"
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "admin_update_cuidadores" on public."RegistrosCuidadores";
create policy "admin_update_cuidadores"
on public."RegistrosCuidadores"
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_delete_cuidadores" on public."RegistrosCuidadores";
create policy "admin_delete_cuidadores"
on public."RegistrosCuidadores"
for delete
to authenticated
using (public.is_admin_user());


drop policy if exists "admin_select_transportistas" on public."RegistrosTransportistas";
create policy "admin_select_transportistas"
on public."RegistrosTransportistas"
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "admin_update_transportistas" on public."RegistrosTransportistas";
create policy "admin_update_transportistas"
on public."RegistrosTransportistas"
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_delete_transportistas" on public."RegistrosTransportistas";
create policy "admin_delete_transportistas"
on public."RegistrosTransportistas"
for delete
to authenticated
using (public.is_admin_user());


drop policy if exists "admin_select_solicitudes_cuidado" on public."SolicitudesCuidado";
create policy "admin_select_solicitudes_cuidado"
on public."SolicitudesCuidado"
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "admin_update_solicitudes_cuidado" on public."SolicitudesCuidado";
create policy "admin_update_solicitudes_cuidado"
on public."SolicitudesCuidado"
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_delete_solicitudes_cuidado" on public."SolicitudesCuidado";
create policy "admin_delete_solicitudes_cuidado"
on public."SolicitudesCuidado"
for delete
to authenticated
using (public.is_admin_user());


drop policy if exists "admin_select_solicitudes_traslado" on public."SolicitudesTraslado";
create policy "admin_select_solicitudes_traslado"
on public."SolicitudesTraslado"
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "admin_update_solicitudes_traslado" on public."SolicitudesTraslado";
create policy "admin_update_solicitudes_traslado"
on public."SolicitudesTraslado"
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_delete_solicitudes_traslado" on public."SolicitudesTraslado";
create policy "admin_delete_solicitudes_traslado"
on public."SolicitudesTraslado"
for delete
to authenticated
using (public.is_admin_user());

-- 6) Restrict admin users table access
alter table public.admin_users enable row level security;

drop policy if exists "admin_users_select" on public.admin_users;
create policy "admin_users_select"
on public.admin_users
for select
to authenticated
using (public.is_admin_user());

-- 7) Seed initial admins (idempotent)
insert into public.admin_users (email)
values
  ('martinrinaudo03@gmail.com'),
  ('beatrizaraya123@gmail.com')
on conflict (email) do nothing;

commit;
