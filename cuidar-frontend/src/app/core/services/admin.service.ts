import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

export type EstadoSolicitud = 'nueva' | 'vista' | 'en_proceso' | 'asignada' | 'cancelada';

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

  async getCuidadores() {
    const { data, error } = await this.supabaseService.client
      .from('RegistrosCuidadores')
      .select('*')
      .order('FechaEnvio', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getTransportistas() {
    const { data, error } = await this.supabaseService.client
      .from('RegistrosTransportistas')
      .select('*')
      .order('FechaEnvio', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getSolicitudesCuidado() {
    const { data, error } = await this.supabaseService.client
      .from('SolicitudesCuidado')
      .select('*')
      .order('FechaEnvio', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getSolicitudesTraslado() {
    const { data, error } = await this.supabaseService.client
      .from('SolicitudesTraslado')
      .select('*')
      .order('FechaEnvio', { ascending: false });
    if (error) throw error;
    return data || [];
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
}
