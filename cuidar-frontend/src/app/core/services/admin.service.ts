import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

export type EstadoSolicitud = 'nueva' | 'vista' | 'en_proceso' | 'asignada' | 'cancelada';
export type AdminValue = string | number | boolean | null | undefined;

export interface AdminRecord {
  Id?: number | string;
  id?: number | string;
  estado?: string | null;
  FechaEnvio?: string | null;
  Nombre?: string | null;
  Email?: string | null;
  Telefono?: string | null;
  ZonaCobertura?: string | null;
  Horario?: string | null;
  Vehiculo?: boolean | null;
  Experiencia?: string | null;
  Dias?: string | null;
  Referencias?: string | null;
  TipoVehiculo?: string | null;
  AceptaSillaDeRuedas?: boolean | null;
  AceptaPagoParticular?: boolean | null;
  NombreFamiliar?: string | null;
  Descripcion?: string | null;
  Zona?: string | null;
  Origen?: string | null;
  Destino?: string | null;
  FechaHora?: string | null;
  DiasDisponibles?: string | null;
  Domicilio?: string | null;
  DescripcionTareas?: string | null;
  [key: string]: AdminValue;
}

export interface AdminPagedResult<T extends AdminRecord = AdminRecord> {
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
    const { error } = await this.supabaseService.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://cuid-ar-blush.vercel.app/admin/login'
      }
    });

    if (error) {
      throw new Error(this.supabaseService.formatError(error, 'No se pudo iniciar sesión con Google.'));
    }
  }

  async getCuidadores(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult> {
    return this.getPagedFromTable('RegistrosCuidadores', page, pageSize);
  }

  async getTransportistas(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult> {
    return this.getPagedFromTable('RegistrosTransportistas', page, pageSize);
  }

  async getSolicitudesCuidado(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult> {
    return this.getPagedFromTable('SolicitudesCuidado', page, pageSize);
  }

  async getSolicitudesTraslado(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult> {
    return this.getPagedFromTable('SolicitudesTraslado', page, pageSize);
  }

  async getEmpleadasDomesticas(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult> {
    return this.getPagedFromTable('RegistrosEmpleadasDomesticas', page, pageSize);
  }

  async getSolicitudesEmpleadaDomestica(page: number = 1, pageSize: number = 25): Promise<AdminPagedResult> {
    return this.getPagedFromTable('SolicitudesEmpleadaDomestica', page, pageSize);
  }

  async logout(): Promise<void> {
    const { error } = await this.supabaseService.client.auth.signOut();
    if (error) {
      throw new Error(this.supabaseService.formatError(error, 'No se pudo cerrar la sesión.'));
    }

    await this.router.navigate(['/admin/login']);
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const { data: { session } } = await this.supabaseService.safeGetSession();
      return !!session;
    } catch (error) {
      console.error('Error al validar la sesión del admin:', error);
      return false;
    }
  }

  async actualizarEstado(
    tableName: string,
    idField: string,
    idValue: number | string,
    estado: EstadoSolicitud
  ): Promise<void> {
    const { error } = await this.supabaseService.client
      .from(tableName)
      .update({ estado })
      .eq(idField, idValue);

    if (error) {
      throw new Error(this.supabaseService.formatError(error, 'No se pudo actualizar el estado.'));
    }
  }

  async eliminarRegistro(tableName: string, idField: string, idValue: number | string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from(tableName)
      .delete()
      .eq(idField, idValue);

    if (error) {
      throw new Error(this.supabaseService.formatError(error, 'No se pudo eliminar el registro.'));
    }
  }

  private async getPagedFromTable(tableName: string, page: number, pageSize: number): Promise<AdminPagedResult> {
    const safePage = Math.max(1, Math.floor(page));
    const safePageSize = Math.max(1, Math.floor(pageSize));
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;

    const { data, error, count } = await this.supabaseService.client
      .from(tableName)
      .select('*', { count: 'planned' })
      .order('FechaEnvio', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(this.supabaseService.formatError(error, 'No se pudieron cargar los registros del panel.'));
    }

    return {
      data: (data ?? []) as AdminRecord[],
      total: count ?? 0,
      page: safePage,
      pageSize: safePageSize
    };
  }
}
