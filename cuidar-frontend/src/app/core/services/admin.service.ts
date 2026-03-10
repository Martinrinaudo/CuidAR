import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map } from 'rxjs';
import { Router } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'https://cvakzhgrnarlcvixhqzx.supabase.co/functions/v1/admin';
  private supabase: SupabaseClient = supabase;

  login(): Observable<void> {
    return from(
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://cuid-ar-blush.vercel.app/admin/login'
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
    await supabase.auth.signOut();
    this.router.navigate(['/admin/login']);
  }

  async isLoggedIn(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  async getToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }

  getSupabaseClient(): SupabaseClient {
    return supabase;
  }
}
