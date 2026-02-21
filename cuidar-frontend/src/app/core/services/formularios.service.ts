import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://localhost:7223/api/formularios';

  registrarCuidador(dto: {
    nombre: string;
    email: string;
    telefono: string;
    experiencia: string;
    zonaCobertura: string;
    vehiculo: boolean;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/cuidador`, dto);
  }

  registrarTransportista(dto: {
    nombre: string;
    email: string;
    telefono: string;
    zonaCobertura: string;
    tipoVehiculo: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/transportista`, dto);
  }

  crearSolicitudCuidado(dto: {
    nombre: string;
    email: string;
    telefono: string;
    nombreFamiliar: string;
    descripcion: string;
    zona: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/solicitud-cuidado`, dto);
  }

  crearSolicitudTraslado(dto: {
    nombre: string;
    email: string;
    telefono: string;
    nombreFamiliar: string;
    origen: string;
    destino: string;
    fechaHora: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/solicitud-traslado`, dto);
  }
}
