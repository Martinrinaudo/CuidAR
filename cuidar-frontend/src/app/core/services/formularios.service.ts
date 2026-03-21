import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

interface SupabaseLikeError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
  status?: number;
}

@Injectable({ providedIn: 'root' })
export class FormulariosService {
  constructor(private supabaseService: SupabaseService) {}

  private async getRequiredUserId(): Promise<string> {
    const {
      data: { session },
      error
    } = await this.supabaseService.safeGetSession();

    if (error) {
      throw new Error('No se pudo validar la sesion del usuario.');
    }

    const userId = session?.user?.id;
    if (!userId) {
      throw new Error('Debes iniciar sesion para enviar este formulario.');
    }

    return userId;
  }

  private mapSupabaseError(error: SupabaseLikeError): string {
    const rawMessage = `${error?.message ?? ''} ${error?.details ?? ''}`.toLowerCase();

    if (error?.code === '42501' || rawMessage.includes('row-level security')) {
      return 'No tienes permisos para esta operacion (RLS). Verifica tu sesion e intenta nuevamente.';
    }

    if (error?.status === 403 || rawMessage.includes('forbidden')) {
      return 'Acceso denegado (403). Tu usuario no cumple las politicas de seguridad.';
    }

    if (error?.status === 401 || rawMessage.includes('jwt') || rawMessage.includes('auth')) {
      return 'Tu sesion expiro o no es valida. Inicia sesion nuevamente.';
    }

    return error?.message || 'Ocurrio un error inesperado al guardar.';
  }

  async registrarCuidador(data: any) {
    const { error } = await this.supabaseService.client.from('RegistrosCuidadores').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      Experiencia: data.experiencia,
      ZonaCobertura: data.zonaCobertura,
      Horario: data.horario,
      Dias: data.dias,
      Referencias: data.referencias,
      Vehiculo: data.vehiculo,
      estado: 'nueva',
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Cuidador registrado' };
  }

  async registrarTransportista(data: any) {
    const { error } = await this.supabaseService.client.from('RegistrosTransportistas').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      ZonaCobertura: data.zonaCobertura,
      TipoVehiculo: data.tipoVehiculo,
      AceptaSillaDeRuedas: data.aceptaSillaDeRuedas,
      AceptaPagoParticular: data.aceptaPagoParticular,
      estado: 'nueva',
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Transportista registrado' };
  }

  async crearSolicitudCuidado(data: any) {
    const { error } = await this.supabaseService.client.from('SolicitudesCuidado').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      NombreFamiliar: data.nombreFamiliar,
      Descripcion: data.descripcion,
      Zona: data.zona,
      estado: 'nueva',
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Solicitud registrada' };
  }

  async crearSolicitudTraslado(data: any) {
    const { error } = await this.supabaseService.client.from('SolicitudesTraslado').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      NombreFamiliar: data.nombreFamiliar,
      Origen: data.origen,
      Destino: data.destino,
      FechaHora: data.fechaHora,
      estado: 'nueva',
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Solicitud registrada' };
  }

  async registrarEmpleadaDomestica(data: any) {
    const userId = await this.getRequiredUserId();

    const { error } = await this.supabaseService.client.from('RegistrosEmpleadasDomesticas').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      DiasDisponibles: data.diasDisponibles,
      Zona: data.zona,
      Descripcion: data.descripcion,
      estado: 'nueva',
      FechaEnvio: new Date().toISOString(),
      user_id: userId,
      created_at: new Date().toISOString()
    });

    if (error) {
      throw new Error(this.mapSupabaseError(error as SupabaseLikeError));
    }

    return { message: 'Postulacion registrada' };
  }

  async crearSolicitudEmpleadaDomestica(data: any) {
    const userId = await this.getRequiredUserId();

    const { error } = await this.supabaseService.client.from('SolicitudesEmpleadaDomestica').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      Zona: data.zona,
      Domicilio: data.domicilio,
      DescripcionTareas: data.descripcionTareas,
      estado: 'nueva',
      FechaEnvio: new Date().toISOString(),
      user_id: userId,
      created_at: new Date().toISOString()
    });

    if (error) {
      throw new Error(this.mapSupabaseError(error as SupabaseLikeError));
    }

    return { message: 'Solicitud registrada' };
  }
}
