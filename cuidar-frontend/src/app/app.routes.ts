import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'formularios/cuidador',
    loadComponent: () => import('./features/formularios/cuidador/cuidador.component').then(m => m.CuidadorComponent)
  },
  {
    path: 'formularios/transportista',
    loadComponent: () => import('./features/formularios/transportista/transportista.component').then(m => m.TransportistaComponent)
  },
  {
    path: 'formularios/solicitud-cuidado',
    loadComponent: () => import('./features/formularios/solicitud-cuidado/solicitud-cuidado.component').then(m => m.SolicitudCuidadoComponent)
  },
  {
    path: 'formularios/solicitud-traslado',
    loadComponent: () => import('./features/formularios/solicitud-traslado/solicitud-traslado.component').then(m => m.SolicitudTrasladoComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/panel',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
