import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    __cuidarSupabaseClient?: SupabaseClient;
  }
}

function createSupabaseSingleton(): SupabaseClient {
  if (window.__cuidarSupabaseClient) {
    return window.__cuidarSupabaseClient;
  }

  const client = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
    auth: {
      detectSessionInUrl: true,
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'cuidar-auth-token'
    }
  });

  window.__cuidarSupabaseClient = client;
  return client;
}

export const supabase = createSupabaseSingleton();

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient = supabase;

  isLockManagerConflict(error: unknown): boolean {
    if (!error) return false;
    const message = error instanceof Error ? error.message : String(error);
    return message.includes('Navigator LockManager') || message.includes('lock:sb-');
  }

  async safeGetSession() {
    try {
      return await this.client.auth.getSession();
    } catch (error) {
      if (this.isLockManagerConflict(error)) {
        // Evita romper el flujo si ocurre un lock race transitorio entre tabs o procesos.
        return { data: { session: null }, error: null };
      }
      throw error;
    }
  }
}
