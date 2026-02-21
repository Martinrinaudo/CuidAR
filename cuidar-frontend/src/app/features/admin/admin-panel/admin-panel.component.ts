import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
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

  cargarDatos(): void {
    this.cargando = true;
    
    // Cargar todos los datos
    this.adminService.getCuidadores().subscribe({
      next: (data) => this.cuidadores = data,
      error: (err) => console.error('Error al cargar cuidadores:', err)
    });

    this.adminService.getTransportistas().subscribe({
      next: (data) => this.transportistas = data,
      error: (err) => console.error('Error al cargar transportistas:', err)
    });

    this.adminService.getSolicitudesCuidado().subscribe({
      next: (data) => this.solicitudesCuidado = data,
      error: (err) => console.error('Error al cargar solicitudes de cuidado:', err)
    });

    this.adminService.getSolicitudesTraslado().subscribe({
      next: (data) => {
        this.solicitudesTraslado = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes de traslado:', err);
        this.cargando = false;
      }
    });
  }

  cerrarSesion(): void {
    this.adminService.logout();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleString('es-AR');
  }
}
