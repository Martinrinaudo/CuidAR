import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { supabase } from '../supabase.client';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/functions/v1/admin')) {
    return next(req);
  }
  
  return from(supabase.auth.getSession()).pipe(
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
