import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Ya no se usan Edge Functions - las consultas van directamente a Supabase
  return next(req);
};
