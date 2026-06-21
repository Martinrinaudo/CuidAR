import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const supabaseService = inject(SupabaseService);

  try {
    const { data: { session } } = await supabaseService.safeGetSession();
    if (session) {
      return true;
    }
  } catch (error) {
    console.error('Error al validar la sesión del admin:', error);
  }

  return router.createUrlTree(['/admin/login']);
};
