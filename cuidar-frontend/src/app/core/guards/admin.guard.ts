import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.client';

const ADMIN_EMAILS = ['martinrinaudo03@gmail.com', 'beatrizaraya123@gmail.com'];

export const adminGuard = async () => {
  const router = inject(Router);
  const { data: { session } } = await supabase.auth.getSession();

  if (session && ADMIN_EMAILS.includes(session.user.email ?? '')) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
