import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPanelComponent implements OnInit {
  private adminService = inject(AdminService);

  tabActiva: string = 'cuidadores';
  cargando: boolean = false;
  
  cuidadores: any[] = [];
  transportistas: any[] = [];
  solicitudesCuidado: any[] = [];
  solicitudesTraslado: any[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cambiarTab(tab: string): void {
    this.tabActiva = tab;
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    
    try {
      // Cargar todos los datos en paralelo
      const [cuidadores, transportistas, solicitudesCuidado, solicitudesTraslado] = await Promise.all([
        this.adminService.getCuidadores(),
        this.adminService.getTransportistas(),
        this.adminService.getSolicitudesCuidado(),
        this.adminService.getSolicitudesTraslado()
      ]);

      this.cuidadores = cuidadores;
      this.transportistas = transportistas;
      this.solicitudesCuidado = solicitudesCuidado;
      this.solicitudesTraslado = solicitudesTraslado;
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      this.cargando = false;
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      await this.adminService.logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleString('es-AR');
  }
}
