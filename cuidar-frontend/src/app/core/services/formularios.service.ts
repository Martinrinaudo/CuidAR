import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class FormulariosService {

  async registrarCuidador(data: any) {
    const { error } = await supabase.from('RegistrosCuidador').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      Experiencia: data.experiencia,
      ZonaCobertura: data.zonaCobertura,
      Horario: data.horario,
      Dias: data.dias,
      Referencias: data.referencias,
      Vehiculo: data.vehiculo,
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Cuidador registrado' };
  }

  async registrarTransportista(data: any) {
    const { error } = await supabase.from('RegistrosTransportista').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      ZonaCobertura: data.zonaCobertura,
      TipoVehiculo: data.tipoVehiculo,
      AceptaSillaDeRuedas: data.aceptaSillaDeRuedas,
      AceptaPagoParticular: data.aceptaPagoParticular,
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Transportista registrado' };
  }

  async crearSolicitudCuidado(data: any) {
    const { error } = await supabase.from('SolicitudesCuidado').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      NombreFamiliar: data.nombreFamiliar,
      Descripcion: data.descripcion,
      Zona: data.zona,
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Solicitud registrada' };
  }

  async crearSolicitudTraslado(data: any) {
    const { error } = await supabase.from('SolicitudesTraslado').insert({
      Nombre: data.nombre,
      Email: data.email,
      Telefono: data.telefono,
      NombreFamiliar: data.nombreFamiliar,
      Origen: data.origen,
      Destino: data.destino,
      FechaHora: data.fechaHora,
      FechaEnvio: new Date().toISOString()
    });
    if (error) throw error;
    return { message: 'Solicitud registrada' };
  }
}
