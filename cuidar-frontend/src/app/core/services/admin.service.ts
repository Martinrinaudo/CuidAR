import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.client';
import { environment } from '../../../environments/environment';

const EDGE_ADMIN_URL = `${environment.supabaseUrl}/functions/v1/admin`;

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private router: Router) {}

  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token ?? ''}`,
      'Content-Type': 'application/json',
      'apikey': environment.supabaseAnonKey
    };
  }

  async login(): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://cuid-ar-blush.vercel.app/admin/login'
      }
    });
  }

  async getCuidadores() {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${EDGE_ADMIN_URL}/cuidadores`, { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async getTransportistas() {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${EDGE_ADMIN_URL}/transportistas`, { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async getSolicitudesCuidado() {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${EDGE_ADMIN_URL}/solicitudes-cuidado`, { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async getSolicitudesTraslado() {
    const headers = await this.getAuthHeaders();
    const res = await fetch(`${EDGE_ADMIN_URL}/solicitudes-traslado`, { headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.router.navigate(['/admin/login']);
  }

  async isLoggedIn(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }
}
