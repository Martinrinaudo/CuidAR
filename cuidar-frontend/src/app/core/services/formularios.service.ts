import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://cvakzhgrnarlcvixhqzx.supabase.co/functions/v1/formularios';
  private readonly ANON_KEY = 'sb_publishable_oFJObocsinXhow22T99Ocg_lZvTrKeq';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': this.ANON_KEY
    });
  }

  registrarCuidador(dto: {
    nombre: string;
    email: string;
    telefono: string;
    experiencia: string;
    zonaCobertura: string;
    vehiculo: boolean;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/cuidador`, dto, { headers: this.getHeaders() });
  }

  registrarTransportista(dto: {
    nombre: string;
    email: string;
    telefono: string;
    zonaCobertura: string;
    tipoVehiculo: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/transportista`, dto, { headers: this.getHeaders() });
  }

  crearSolicitudCuidado(dto: {
    nombre: string;
    email: string;
    telefono: string;
    nombreFamiliar: string;
    descripcion: string;
    zona: string;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/solicitud-cuidado`, dto, { headers: this.getHeaders() });
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
    return this.http.post(`${this.API_URL}/solicitud-traslado`, dto, { headers: this.getHeaders() });
  }
}
