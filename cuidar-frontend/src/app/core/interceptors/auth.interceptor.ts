import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AdminService } from '../services/admin.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const adminService = inject(AdminService);
  const ANON_KEY = 'sb_publishable_oFJObocsinXhow22T99Ocg_lZvTrKeq';
  
  // Solo agregar token a requests que vayan a las Edge Functions de admin
  if (req.url.includes('/functions/v1/admin')) {
    return from(adminService.getToken()).pipe(
      switchMap(token => {
        if (token) {
          req = req.clone({
            setHeaders: {
              'apikey': 'sb_publishable_oFJObocsinXhow22T99Ocg_lZvTrKeq',
              'Authorization': `Bearer ${token}`
            }
          });
        }
        return next(req);
      })
    );
  }
  
  return next(req);
};
