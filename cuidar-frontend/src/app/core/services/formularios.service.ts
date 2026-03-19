import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class FormulariosService {
  constructor(private supabaseService: SupabaseService) {}

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
    const { error } = await this.supabaseService.client.from('RegistrosEmpleadasDomesticas').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      DiasDisponibles: data.diasDisponibles,
      Zona: data.zona,
      Descripcion: data.descripcion,
      estado: 'nueva',
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Postulacion registrada' };
  }

  async crearSolicitudEmpleadaDomestica(data: any) {
    const { error } = await this.supabaseService.client.from('SolicitudesEmpleadaDomestica').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      Zona: data.zona,
      Domicilio: data.domicilio,
      DescripcionTareas: data.descripcionTareas,
      estado: 'nueva',
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Solicitud registrada' };
  }
}
