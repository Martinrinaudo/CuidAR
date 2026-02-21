import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  nombre: string;
  tipo: string;
}

interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  tipo: 'Cuidador' | 'Solicitante';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7223/api/usuarios';
  private tokenKey = 'auth_token';
  private userNameKey = 'user_name';
  private userRoleKey = 'user_role';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userNameKey, response.nombre);
          localStorage.setItem(this.userRoleKey, response.tipo);
        }
      })
    );
  }

  register(dto: RegisterDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dto);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userNameKey);
    localStorage.removeItem(this.userRoleKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }
}
