import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

export type EstadoSolicitud = 'nueva' | 'vista' | 'en_proceso' | 'asignada' | 'cancelada';

export interface AdminPagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async login(): Promise<void> {
    await this.supabaseService.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://cuid-ar-blush.vercel.app/admin/login'
      }
    });
  }

  async getCuidadores(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult<any>> {
    return this.getPagedFromTable('RegistrosCuidadores', page, pageSize);
  }

  async getTransportistas(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult<any>> {
    return this.getPagedFromTable('RegistrosTransportistas', page, pageSize);
  }

  async getSolicitudesCuidado(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult<any>> {
    return this.getPagedFromTable('SolicitudesCuidado', page, pageSize);
  }

  async getSolicitudesTraslado(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult<any>> {
    return this.getPagedFromTable('SolicitudesTraslado', page, pageSize);
  }

  async getEmpleadasDomesticas(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult<any>> {
    return this.getPagedFromTable('RegistrosEmpleadasDomesticas', page, pageSize);
  }

  async getSolicitudesEmpleadaDomestica(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult<any>> {
    return this.getPagedFromTable('SolicitudesEmpleadaDomestica', page, pageSize);
  }

  async logout(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.router.navigate(['/admin/login']);
  }

  async isLoggedIn(): Promise<boolean> {
    const { data: { session } } = await this.supabaseService.safeGetSession();
    return !!session;
  }

  async actualizarEstado(tableName: string, idField: string, idValue: number | string, estado: EstadoSolicitud): Promise<void> {
    const { error } = await this.supabaseService.client
      .from(tableName)
      .update({ estado })
      .eq(idField, idValue);

    if (error) throw error;
  }

  async eliminarRegistro(tableName: string, idField: string, idValue: number | string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from(tableName)
      .delete()
      .eq(idField, idValue);

    if (error) throw error;
  }

  private async getPagedFromTable(tableName: string, page: number, pageSize: number): Promise<AdminPagedResult<any>> {
    const safePage = Math.max(1, Math.floor(page));
    const safePageSize = Math.max(1, Math.floor(pageSize));
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;

    const { data, error, count } = await this.supabaseService.client
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('FechaEnvio', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count ?? 0,
      page: safePage,
      pageSize: safePageSize
    };
  }
}
