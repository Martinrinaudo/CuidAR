import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminService } from '../services/admin.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const adminService = inject(AdminService);
  
  // Solo agregar token a requests que vayan a /api/admin/*
  if (req.url.includes('/api/admin/') && !req.url.includes('/api/admin/login')) {
    const token = adminService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
  
  return next(req);
};
