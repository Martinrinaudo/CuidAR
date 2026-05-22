import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { adminGuard } from './admin.guard';
import { SupabaseService } from '../services/supabase.service';
import { vi } from 'vitest';

describe('adminGuard', () => {
  let routerSpy: any;
  let supabaseServiceSpy: any;
  const loginTree = {} as UrlTree;

  beforeEach(() => {
    routerSpy = {
      createUrlTree: vi.fn(() => loginTree),
      navigate: vi.fn()
    };
    supabaseServiceSpy = { safeGetSession: vi.fn() };
    
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: SupabaseService, useValue: supabaseServiceSpy }
      ]
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  it('debe permitir el acceso y retornar true si hay sesión activa', async () => {
    supabaseServiceSpy.safeGetSession.mockResolvedValue({
      data: { session: { user: { id: '123' } } } 
    });
    
    const result = await TestBed.runInInjectionContext(() => adminGuard(route, state));
    
    expect(result).toBe(true);
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('debe bloquear el acceso, retornar false y redirigir a /admin/login si no hay sesión', async () => {
    supabaseServiceSpy.safeGetSession.mockResolvedValue({
      data: { session: null } 
    });
    
    const result = await TestBed.runInInjectionContext(() => adminGuard(route, state));
    
    expect(result).toBe(loginTree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/admin/login']);
  });
});
