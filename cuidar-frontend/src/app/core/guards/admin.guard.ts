import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cvakzhgrnarlcvixhqzx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2YWt6aGdybmFybGN2aXhocXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTA1NjIsImV4cCI6MjA1NTc4NjU2Mn0.hHcPDPBn4HBpkSAmRGaRavlOcaTSp7FiVBPN4HBjPDY'
);

export const adminGuard = async () => {
  const router = inject(Router);
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    return true;
  }
  router.navigate(['/admin/login']);
  return false;
};
