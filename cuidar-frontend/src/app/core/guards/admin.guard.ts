import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const adminService = inject(AdminService);
  const router = inject(Router);
  
  const isLoggedIn = await adminService.isLoggedIn();
  if (isLoggedIn) {
    return true;
  }
  
  router.navigate(['/admin/login']);
  return false;
};
