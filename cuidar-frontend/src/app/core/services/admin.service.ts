import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map } from 'rxjs';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cvakzhgrnarlcvixhqzx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YWt6aGdybmFybGN2aXhocXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTA1NjIsImV4cCI6MjA1NTc4NjU2Mn0.hHcPDPBn4HBpkSAmRGaRavlOcaTSp7FiVBPN4HBjPDY';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'https://cvakzhgrnarlcvixhqzx.supabase.co/functions/v1/admin';
  private supabase: SupabaseClient;
  private sessionInitialized = false;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    this.initializeSession();
  }

  private async initializeSession(): Promise<void> {
    // Esperar a que Supabase procese la sesión de la URL (callback de OAuth)
    await this.supabase.auth.getSession();
    this.sessionInitialized = true;
  }

  async waitForSessionInit(): Promise<void> {
    // Esperar hasta que la sesión esté inicializada
    while (!this.sessionInitialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  login(): Observable<void> {
    return from(
      this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin/panel'
        }
      })
    ).pipe(
      map(() => void 0)
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

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.router.navigate(['/admin/login']);
  }

  async isLoggedIn(): Promise<boolean> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return !!session;
  }

  async getToken(): Promise<string | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.access_token ?? null;
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}
