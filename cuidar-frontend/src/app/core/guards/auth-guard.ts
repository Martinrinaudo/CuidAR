import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (_route, _state) => {
  const router = inject(Router);
  const supabaseService = inject(SupabaseService);
  const { data: { session } } = await supabaseService.safeGetSession();
  if (session) return true;
  router.navigate(['/admin/login']);
  return false;
};
