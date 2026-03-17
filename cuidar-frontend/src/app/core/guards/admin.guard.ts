import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const adminGuard = async () => {
  const router = inject(Router);
  const supabaseService = inject(SupabaseService);
  const { data: { session } } = await supabaseService.safeGetSession();
  if (session) return true;
  router.navigate(['/admin/login']);
  return false;
};
