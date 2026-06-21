import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface CuidadorFormData {
  nombre: string;
  email: string;
  telefono: string;
  experiencia: string;
  zonaCobertura: string;
  horario: string;
  dias: string;
  referencias: string;
  vehiculo: boolean;
}

export interface TransportistaFormData {
  nombre: string;
  email: string;
  telefono: string;
  zonaCobertura: string;
  tipoVehiculo: string;
  aceptaSillaDeRuedas: boolean;
  aceptaPagoParticular: boolean;
}

export interface SolicitudCuidadoFormData {
  nombre: string;
  email: string;
  telefono: string;
  nombreFamiliar: string;
  descripcion: string;
  zona: string;
}

export interface SolicitudTrasladoFormData {
  nombre: string;
  email: string;
  telefono: string;
  nombreFamiliar: string;
  origen: string;
  destino: string;
  fechaHora: string;
}

export interface EmpleadaDomesticaFormData {
  nombre: string;
  email: string;
  telefono: string;
  diasDisponibles: string;
  zona: string;
  descripcion: string;
}

export interface SolicitudEmpleadaDomesticaFormData {
  nombre: string;
  email: string;
  telefono: string;
  zona: string;
  domicilio: string;
  descripcionTareas: string;
}

type FormValue = string | boolean;

@Injectable({ providedIn: 'root' })
export class FormulariosService {
  constructor(private supabaseService: SupabaseService) {}

  private requireText(value: string, field: string): string {
    const normalized = value.trim();
    if (!normalized) {
      throw new Error(`El campo ${field} es obligatorio.`);
    }

    return normalized;
  }

  private requireBoolean(value: boolean, field: string): boolean {
    if (typeof value !== 'boolean') {
      throw new Error(`El campo ${field} debe ser booleano.`);
    }

    return value;
  }

  private requireDateTime(value: string, field: string): string {
    const normalized = this.requireText(value, field);
    const candidate = normalized.endsWith('Z') ? normalized : `${normalized}:00Z`;

    if (Number.isNaN(Date.parse(candidate))) {
      throw new Error(`El campo ${field} debe tener un horario valido.`);
    }

    return new Date(candidate).toISOString();
  }

  private timestamp(): string {
    return new Date().toISOString();
  }

  private buildErrorMessage(error: unknown, fallbackMessage: string): string {
    return this.supabaseService.formatError(error, fallbackMessage);
  }

  async registrarCuidador(data: CuidadorFormData): Promise<{ message: string }> {
    const { error } = await this.supabaseService.client.from('RegistrosCuidadores').insert({
      Nombre: this.requireText(data.nombre, 'nombre'),
      Email: this.requireText(data.email, 'email'),
      Telefono: this.requireText(data.telefono, 'telefono'),
      Experiencia: this.requireText(data.experiencia, 'experiencia'),
      ZonaCobertura: this.requireText(data.zonaCobertura, 'zonaCobertura'),
      Horario: this.requireText(data.horario, 'horario'),
      Dias: this.requireText(data.dias, 'dias'),
      Referencias: this.requireText(data.referencias, 'referencias'),
      Vehiculo: this.requireBoolean(data.vehiculo, 'vehiculo'),
      estado: 'nueva',
      FechaEnvio: this.timestamp()
    });

    if (error) {
      throw new Error(this.buildErrorMessage(error, 'No se pudo registrar el cuidador.'));
    }

    return { message: 'Cuidador registrado' };
  }

  async registrarTransportista(data: TransportistaFormData): Promise<{ message: string }> {
    const { error } = await this.supabaseService.client.from('RegistrosTransportistas').insert({
      Nombre: this.requireText(data.nombre, 'nombre'),
      Email: this.requireText(data.email, 'email'),
      Telefono: this.requireText(data.telefono, 'telefono'),
      ZonaCobertura: this.requireText(data.zonaCobertura, 'zonaCobertura'),
      TipoVehiculo: this.requireText(data.tipoVehiculo, 'tipoVehiculo'),
      AceptaSillaDeRuedas: this.requireBoolean(data.aceptaSillaDeRuedas, 'aceptaSillaDeRuedas'),
      AceptaPagoParticular: this.requireBoolean(data.aceptaPagoParticular, 'aceptaPagoParticular'),
      estado: 'nueva',
      FechaEnvio: this.timestamp()
    });

    if (error) {
      throw new Error(this.buildErrorMessage(error, 'No se pudo registrar el transportista.'));
    }

    return { message: 'Transportista registrado' };
  }

  async crearSolicitudCuidado(data: SolicitudCuidadoFormData): Promise<{ message: string }> {
    const { error } = await this.supabaseService.client.from('SolicitudesCuidado').insert({
      Nombre: this.requireText(data.nombre, 'nombre'),
      Email: this.requireText(data.email, 'email'),
      Telefono: this.requireText(data.telefono, 'telefono'),
      NombreFamiliar: this.requireText(data.nombreFamiliar, 'nombreFamiliar'),
      Descripcion: this.requireText(data.descripcion, 'descripcion'),
      Zona: this.requireText(data.zona, 'zona'),
      estado: 'nueva',
      FechaEnvio: this.timestamp()
    });

    if (error) {
      throw new Error(this.buildErrorMessage(error, 'No se pudo registrar la solicitud de cuidado.'));
    }

    return { message: 'Solicitud registrada' };
  }

  async crearSolicitudTraslado(data: SolicitudTrasladoFormData): Promise<{ message: string }> {
    const { error } = await this.supabaseService.client.from('SolicitudesTraslado').insert({
      Nombre: this.requireText(data.nombre, 'nombre'),
      Email: this.requireText(data.email, 'email'),
      Telefono: this.requireText(data.telefono, 'telefono'),
      NombreFamiliar: this.requireText(data.nombreFamiliar, 'nombreFamiliar'),
      Origen: this.requireText(data.origen, 'origen'),
      Destino: this.requireText(data.destino, 'destino'),
      FechaHora: this.requireDateTime(data.fechaHora, 'fechaHora'),
      estado: 'nueva',
      FechaEnvio: this.timestamp()
    });

    if (error) {
      throw new Error(this.buildErrorMessage(error, 'No se pudo registrar la solicitud de traslado.'));
    }

    return { message: 'Solicitud registrada' };
  }

  async registrarEmpleadaDomestica(data: EmpleadaDomesticaFormData): Promise<{ message: string }> {
    const userId = await this.getRequiredUserId();

    const { error } = await this.supabaseService.client.from('RegistrosEmpleadasDomesticas').insert({
      Nombre: this.requireText(data.nombre, 'nombre'),
      Email: this.requireText(data.email, 'email'),
      Telefono: this.requireText(data.telefono, 'telefono'),
      DiasDisponibles: this.requireText(data.diasDisponibles, 'diasDisponibles'),
      Zona: this.requireText(data.zona, 'zona'),
      Descripcion: this.requireText(data.descripcion, 'descripcion'),
      estado: 'nueva',
      FechaEnvio: this.timestamp(),
      user_id: userId,
      created_at: this.timestamp()
    });

    if (error) {
      throw new Error(this.buildErrorMessage(error, 'No se pudo registrar la postulación.'));
    }

    return { message: 'Postulacion registrada' };
  }

  async crearSolicitudEmpleadaDomestica(data: SolicitudEmpleadaDomesticaFormData): Promise<{ message: string }> {
    const userId = await this.getRequiredUserId();

    const { error } = await this.supabaseService.client.from('SolicitudesEmpleadaDomestica').insert({
      Nombre: this.requireText(data.nombre, 'nombre'),
      Email: this.requireText(data.email, 'email'),
      Telefono: this.requireText(data.telefono, 'telefono'),
      Zona: this.requireText(data.zona, 'zona'),
      Domicilio: this.requireText(data.domicilio, 'domicilio'),
      DescripcionTareas: this.requireText(data.descripcionTareas, 'descripcionTareas'),
      estado: 'nueva',
      FechaEnvio: this.timestamp(),
      user_id: userId,
      created_at: this.timestamp()
    });

    if (error) {
      throw new Error(this.buildErrorMessage(error, 'No se pudo registrar la solicitud.'));
    }

    return { message: 'Solicitud registrada' };
  }

  private async getRequiredUserId(): Promise<string> {
    const {
      data: { session },
      error
    } = await this.supabaseService.safeGetSession();

    if (error) {
      throw new Error(this.buildErrorMessage(error, 'No se pudo validar la sesion del usuario.'));
    }

    const userId = session?.user?.id;
    if (!userId) {
      throw new Error('Debes iniciar sesion para enviar este formulario.');
    }

    return userId;
  }
}
