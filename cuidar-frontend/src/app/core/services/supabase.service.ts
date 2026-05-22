import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface SupabaseErrorLike {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
  status?: number;
}

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
      storageKey: 'cuidar-auth-token',
      lock: async <T>(_name: string, _acquireTimeout: number, fn: () => Promise<T>): Promise<T> => {
        // Evita conflictos del Navigator LockManager en algunos navegadores/tabs.
        return await fn();
      }
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
    if (!error) {
      return false;
    }

    const message = error instanceof Error ? error.message : String(error);
    return message.includes('Navigator LockManager') || message.includes('lock:sb-');
  }

  formatError(error: unknown, fallbackMessage: string): string {
    if (!error) {
      return fallbackMessage;
    }

    const supabaseError = this.asSupabaseError(error);
    if (supabaseError) {
      const rawMessage = `${supabaseError.message ?? ''} ${supabaseError.details ?? ''}`.toLowerCase();

      if (supabaseError.code === '42501' || rawMessage.includes('row-level security')) {
        return 'No tienes permisos para esta operacion (RLS). Verifica tu sesion e intenta nuevamente.';
      }

      if (supabaseError.status === 403 || rawMessage.includes('forbidden')) {
        return 'Acceso denegado (403). Tu usuario no cumple las politicas de seguridad.';
      }

      if (supabaseError.status === 401 || rawMessage.includes('jwt') || rawMessage.includes('auth')) {
        return 'Tu sesion expiro o no es valida. Inicia sesion nuevamente.';
      }

      return supabaseError.message || fallbackMessage;
    }

    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    return fallbackMessage;
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

  private asSupabaseError(error: unknown): SupabaseErrorLike | null {
    if (typeof error !== 'object' || error === null) {
      return null;
    }

    const candidate = error as SupabaseErrorLike;
    if (
      typeof candidate.code === 'string' ||
      typeof candidate.message === 'string' ||
      typeof candidate.details === 'string' ||
      typeof candidate.hint === 'string' ||
      typeof candidate.status === 'number'
    ) {
      return candidate;
    }

    return null;
  }
}
