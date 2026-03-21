-- Allow admin users to update/delete domestic requests and applications.

begin;

alter table public."RegistrosEmpleadasDomesticas" enable row level security;
alter table public."SolicitudesEmpleadaDomestica" enable row level security;

grant update, delete on public."RegistrosEmpleadasDomesticas" to authenticated;
grant update, delete on public."SolicitudesEmpleadaDomestica" to authenticated;

-- RegistrosEmpleadasDomesticas: admin can update/delete any row.
drop policy if exists "registros_update_admin" on public."RegistrosEmpleadasDomesticas";
create policy "registros_update_admin"
on public."RegistrosEmpleadasDomesticas"
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "registros_delete_admin" on public."RegistrosEmpleadasDomesticas";
create policy "registros_delete_admin"
on public."RegistrosEmpleadasDomesticas"
for delete
to authenticated
using (public.is_admin_user());

-- SolicitudesEmpleadaDomestica: admin can update/delete any row.
drop policy if exists "solicitudes_update_admin" on public."SolicitudesEmpleadaDomestica";
create policy "solicitudes_update_admin"
on public."SolicitudesEmpleadaDomestica"
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "solicitudes_delete_admin" on public."SolicitudesEmpleadaDomestica";
create policy "solicitudes_delete_admin"
on public."SolicitudesEmpleadaDomestica"
for delete
to authenticated
using (public.is_admin_user());

commit;
