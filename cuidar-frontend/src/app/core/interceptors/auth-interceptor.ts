import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const supabaseService = inject(SupabaseService);

  if (!req.url.includes('/functions/v1/admin')) {
    return next(req);
  }
  
  return from(supabaseService.safeGetSession()).pipe(
    switchMap(({ data: { session } }) => {
      if (session) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
