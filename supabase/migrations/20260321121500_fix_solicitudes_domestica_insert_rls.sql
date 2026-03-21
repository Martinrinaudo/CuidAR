-- Hotfix: avoid false RLS rejections on SolicitudesEmpleadaDomestica inserts.

begin;

alter table public."SolicitudesEmpleadaDomestica"
  add column if not exists "user_id" uuid references auth.users(id) on delete cascade,
  add column if not exists "created_at" timestamptz not null default now();

-- Ensure user_id is auto-filled from JWT when omitted by client.
alter table public."SolicitudesEmpleadaDomestica"
  alter column "user_id" set default auth.uid();

create or replace function public.set_solicitud_domestica_user_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new."user_id" is null then
    new."user_id" := auth.uid();
  end if;

  if new."created_at" is null then
    new."created_at" := now();
  end if;

  return new;
end;
$$;

drop trigger if exists trg_set_solicitud_domestica_user_id on public."SolicitudesEmpleadaDomestica";
create trigger trg_set_solicitud_domestica_user_id
before insert on public."SolicitudesEmpleadaDomestica"
for each row
execute function public.set_solicitud_domestica_user_id();

alter table public."SolicitudesEmpleadaDomestica" enable row level security;
grant select, insert, update, delete on public."SolicitudesEmpleadaDomestica" to authenticated;

-- Remove legacy insert policy names if present.
drop policy if exists "anon_insert_solicitudes_empleada_domestica" on public."SolicitudesEmpleadaDomestica";
drop policy if exists "solicitudes_insert_own" on public."SolicitudesEmpleadaDomestica";

create policy "solicitudes_insert_own"
on public."SolicitudesEmpleadaDomestica"
for insert
to authenticated
with check (
  auth.uid() is not null
  and coalesce("user_id", auth.uid()) = auth.uid()
);

-- Keep user-scope read/update/delete policies aligned.
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

-- Admin visibility for /admin/panel.
drop policy if exists "solicitudes_select_admin" on public."SolicitudesEmpleadaDomestica";
create policy "solicitudes_select_admin"
on public."SolicitudesEmpleadaDomestica"
for select
to authenticated
using (public.is_admin_user());

create index if not exists idx_solicitudes_domestica_user_id
  on public."SolicitudesEmpleadaDomestica" ("user_id");

create index if not exists idx_solicitudes_domestica_user_fecha
  on public."SolicitudesEmpleadaDomestica" ("user_id", "FechaEnvio" desc);

commit;
