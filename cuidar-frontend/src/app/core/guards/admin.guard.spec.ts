import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { supabase } from '../supabase.client';
import { vi } from 'vitest';

// Simular el cliente Supabase
vi.mock('../supabase.client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    }
  }
}));

describe('adminGuard', () => {
  let routerSpy: any;

  beforeEach(() => {
    // Configurar espía para el enrutador
    routerSpy = { navigate: vi.fn() };
    
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe permitir el acceso y retornar true si hay sesión activa', async () => {
    // Configurar mock para simular una sesión activa
    (supabase.auth.getSession as any).mockResolvedValue({ 
      data: { session: { user: { id: '123' } } } 
    });
    
    // Ejecutar guard dentro del contexto de inyección
    const result = await TestBed.runInInjectionContext(() => adminGuard());
    
    // Aserciones
    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debe bloquear el acceso, retornar false y redirigir a /admin/login si no hay sesión', async () => {
    // Configurar mock para simular sin sesión
    (supabase.auth.getSession as any).mockResolvedValue({ 
      data: { session: null } 
    });
    
    // Ejecutar guard
    const result = await TestBed.runInInjectionContext(() => adminGuard());
    
    // Aserciones
    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/login']);
  });
});
