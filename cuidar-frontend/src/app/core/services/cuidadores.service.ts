import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cuidador {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  zona: string;
  tarifaPorHora?: number;
  experienciaAnios?: number;
  especialidades?: string;
  presentacion?: string;
  disponible: boolean;
}

export interface CuidadorUpdateDTO {
  zona?: string;
  tarifaPorHora?: number;
  experienciaAnios?: number;
  especialidades?: string;
  presentacion?: string;
  disponible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CuidadoresService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7223/api/cuidadores';

  getAll(zona?: string): Observable<Cuidador[]> {
    let params = new HttpParams();
    if (zona) {
      params = params.set('zona', zona);
    }
    return this.http.get<Cuidador[]>(this.apiUrl, { params });
  }

  updatePerfil(dto: CuidadorUpdateDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, dto);
  }
}
