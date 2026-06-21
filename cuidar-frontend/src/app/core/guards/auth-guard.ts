import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (_route, _state) => {
  const router = inject(Router);
  const supabaseService = inject(SupabaseService);

  try {
    const { data: { session } } = await supabaseService.safeGetSession();
    if (session) {
      return true;
    }
  } catch (error) {
    console.error('Error al validar la sesión:', error);
  }

  return router.createUrlTree(['/admin/login']);
};
