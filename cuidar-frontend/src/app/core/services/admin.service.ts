import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'https://localhost:7223/api/admin';
  private readonly TOKEN_KEY = 'admin_token';

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
          }
        })
      );
  }

  getCuidadores(): Observable<any> {
    return this.http.get(`${this.API_URL}/cuidadores`);
  }

  getTransportistas(): Observable<any> {
    return this.http.get(`${this.API_URL}/transportistas`);
  }

  getSolicitudesCuidado(): Observable<any> {
    return this.http.get(`${this.API_URL}/solicitudes-cuidado`);
  }

  getSolicitudesTraslado(): Observable<any> {
    return this.http.get(`${this.API_URL}/solicitudes-traslado`);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
