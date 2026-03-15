import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private router: Router) {}

  async login(): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://cuid-ar-blush.vercel.app/admin/login'
      }
    });
  }

  async getCuidadores() {
    const { data, error } = await supabase
      .from('RegistrosCuidadores')
      .select('*')
      .order('FechaEnvio', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getTransportistas() {
    const { data, error } = await supabase
      .from('RegistrosTransportistas')
      .select('*')
      .order('FechaEnvio', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getSolicitudesCuidado() {
    const { data, error } = await supabase
      .from('SolicitudesCuidado')
      .select('*')
      .order('FechaEnvio', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getSolicitudesTraslado() {
    const { data, error } = await supabase
      .from('SolicitudesTraslado')
      .select('*')
      .order('FechaEnvio', { ascending: false });
    if (error) throw error;
    return data || [];
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
