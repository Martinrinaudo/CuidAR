import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.client';

export const authGuard: CanActivateFn = async (_route, _state) => {
  const router = inject(Router);
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return true;
  router.navigate(['/admin/login']);
  return false;
};
