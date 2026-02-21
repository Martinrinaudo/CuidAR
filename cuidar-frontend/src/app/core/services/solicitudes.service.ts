import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SolicitudCuidadoDTO {
  nombreFamiliar: string;
  descripcion: string;
  domicilio: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface SolicitudTrasladoDTO {
  nombreFamiliar: string;
  origen: string;
  destino: string;
  fechaHora: string;
}

export interface SolicitudCuidado {
  id: number;
  nombreFamiliar: string;
  descripcion: string;
  domicilio: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

export interface SolicitudTraslado {
  id: number;
  nombreFamiliar: string;
  origen: string;
  destino: string;
  fechaHora: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7223/api/solicitudes';

  crearCuidado(dto: SolicitudCuidadoDTO): Observable<any> {
    // Asegurar formato UTC
    const dtoUTC = {
      ...dto,
      fechaInicio: dto.fechaInicio.endsWith('Z') ? dto.fechaInicio : dto.fechaInicio + 'Z',
      fechaFin: dto.fechaFin.endsWith('Z') ? dto.fechaFin : dto.fechaFin + 'Z'
    };
    return this.http.post(`${this.apiUrl}/cuidado`, dtoUTC);
  }

  crearTraslado(dto: SolicitudTrasladoDTO): Observable<any> {
    // Asegurar formato UTC
    const dtoUTC = {
      ...dto,
      fechaHora: dto.fechaHora.endsWith('Z') ? dto.fechaHora : dto.fechaHora + 'Z'
    };
    return this.http.post(`${this.apiUrl}/traslado`, dtoUTC);
  }

  getMisCuidados(): Observable<SolicitudCuidado[]> {
    return this.http.get<SolicitudCuidado[]>(`${this.apiUrl}/cuidado`);
  }

  getMisTraslados(): Observable<SolicitudTraslado[]> {
    return this.http.get<SolicitudTraslado[]>(`${this.apiUrl}/traslado`);
  }
}
