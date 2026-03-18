import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, EstadoSolicitud } from '../../../core/services/admin.service';

type TabAdmin = 'cuidadores' | 'transportistas' | 'solicitudesCuidado' | 'solicitudesTraslado';

interface EstadoOption {
  value: EstadoSolicitud;
  label: string;
}

interface TablaConfig {
  key: TabAdmin;
  tableName: string;
  labelSingular: string;
}

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

  tabActiva: TabAdmin = 'cuidadores';
  cargando: boolean = false;
  procesando: boolean = false;
  filtroEstado: 'todas' | EstadoSolicitud = 'todas';
  errorMensaje: string = '';
  exitoMensaje: string = '';
  
  cuidadores: any[] = [];
  transportistas: any[] = [];
  solicitudesCuidado: any[] = [];
  solicitudesTraslado: any[] = [];

  readonly estadoOptions: EstadoOption[] = [
    { value: 'nueva', label: 'Nueva' },
    { value: 'vista', label: 'Vista' },
    { value: 'en_proceso', label: 'En proceso' },
    { value: 'asignada', label: 'Asignada' },
    { value: 'cancelada', label: 'Cancelada' }
  ];

  private readonly tablaConfigMap: Record<TabAdmin, TablaConfig> = {
    cuidadores: {
      key: 'cuidadores',
      tableName: 'RegistrosCuidadores',
      labelSingular: 'cuidador'
    },
    transportistas: {
      key: 'transportistas',
      tableName: 'RegistrosTransportistas',
      labelSingular: 'transportista'
    },
    solicitudesCuidado: {
      key: 'solicitudesCuidado',
      tableName: 'SolicitudesCuidado',
      labelSingular: 'solicitud de cuidado'
    },
    solicitudesTraslado: {
      key: 'solicitudesTraslado',
      tableName: 'SolicitudesTraslado',
      labelSingular: 'solicitud de traslado'
    }
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  cambiarTab(tab: TabAdmin): void {
    this.tabActiva = tab;
    this.filtroEstado = 'todas';
    this.limpiarMensajes();
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    
    try {
      // Cargar todos los datos en paralelo sin bloquear todo el panel si una consulta falla.
      const [cuidadoresRes, transportistasRes, solicitudesCuidadoRes, solicitudesTrasladoRes] = await Promise.allSettled([
        this.adminService.getCuidadores(),
        this.adminService.getTransportistas(),
        this.adminService.getSolicitudesCuidado(),
        this.adminService.getSolicitudesTraslado()
      ]);

      this.cuidadores = cuidadoresRes.status === 'fulfilled' ? cuidadoresRes.value : [];
      this.transportistas = transportistasRes.status === 'fulfilled' ? transportistasRes.value : [];
      this.solicitudesCuidado = solicitudesCuidadoRes.status === 'fulfilled' ? solicitudesCuidadoRes.value : [];
      this.solicitudesTraslado = solicitudesTrasladoRes.status === 'fulfilled' ? solicitudesTrasladoRes.value : [];

      const erroresCarga = [
        cuidadoresRes.status === 'rejected',
        transportistasRes.status === 'rejected',
        solicitudesCuidadoRes.status === 'rejected',
        solicitudesTrasladoRes.status === 'rejected'
      ].filter(Boolean).length;

      if (erroresCarga > 0) {
        this.errorMensaje = `Algunas listas no se pudieron cargar (${erroresCarga}/4). Reintenta en unos segundos.`;
      }

      this.cuidadores = this.cuidadores.map((item) => ({ ...item, estado: this.normalizarEstado(item?.estado) }));
      this.transportistas = this.transportistas.map((item) => ({ ...item, estado: this.normalizarEstado(item?.estado) }));
      this.solicitudesCuidado = this.solicitudesCuidado.map((item) => ({ ...item, estado: this.normalizarEstado(item?.estado) }));
      this.solicitudesTraslado = this.solicitudesTraslado.map((item) => ({ ...item, estado: this.normalizarEstado(item?.estado) }));
    } catch (err) {
      console.error('Error al cargar datos:', err);
      this.errorMensaje = 'No se pudieron cargar los registros del panel.';
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

  getEstadoLabel(estado: string | null | undefined): string {
    const estadoNormalizado = this.normalizarEstado(estado);
    return this.estadoOptions.find((option) => option.value === estadoNormalizado)?.label ?? 'Nueva';
  }

  getEstadoClase(estado: string | null | undefined): string {
    const estadoNormalizado = this.normalizarEstado(estado);
    return `estado-${estadoNormalizado}`;
  }

  getRegistrosFiltrados(tab: TabAdmin): any[] {
    const lista = this.getListaByTab(tab);
    if (this.filtroEstado === 'todas') {
      return lista;
    }

    return lista.filter((item) => this.normalizarEstado(item?.estado) === this.filtroEstado);
  }

  getCantidadFiltrada(tab: TabAdmin): number {
    return this.getRegistrosFiltrados(tab).length;
  }

  async cambiarEstado(tab: TabAdmin, registro: any, event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    const nuevoEstado = target.value as EstadoSolicitud;
    const estadoAnterior = this.normalizarEstado(registro?.estado);
    const idData = this.obtenerIdRegistro(registro);

    this.limpiarMensajes();
    registro.estado = nuevoEstado;
    this.procesando = true;

    try {
      const tabla = this.tablaConfigMap[tab];
      await this.adminService.actualizarEstado(tabla.tableName, idData.idField, idData.idValue, nuevoEstado);
      this.exitoMensaje = `Estado actualizado a ${this.getEstadoLabel(nuevoEstado)}.`;
      this.refreshLista(tab);
    } catch (err) {
      registro.estado = estadoAnterior;
      this.errorMensaje = 'No se pudo actualizar el estado. Intenta nuevamente.';
      console.error('Error al actualizar estado:', err);
    } finally {
      this.procesando = false;
    }
  }

  async eliminar(tab: TabAdmin, registro: any): Promise<void> {
    const tabla = this.tablaConfigMap[tab];
    const idData = this.obtenerIdRegistro(registro);

    const confirmar = confirm(`¿Seguro que deseas eliminar esta ${tabla.labelSingular}?`);
    if (!confirmar) {
      return;
    }

    this.limpiarMensajes();
    this.procesando = true;

    try {
      await this.adminService.eliminarRegistro(tabla.tableName, idData.idField, idData.idValue);
      this.eliminarEnMemoria(tab, idData.idField, idData.idValue);
      this.exitoMensaje = 'Registro eliminado correctamente.';
    } catch (err) {
      this.errorMensaje = 'No se pudo eliminar el registro.';
      console.error('Error al eliminar registro:', err);
    } finally {
      this.procesando = false;
    }
  }

  trackByRegistro = (index: number, item: any): string | number => {
    const idValue = item?.Id ?? item?.id;
    if (idValue !== undefined && idValue !== null) {
      return idValue;
    }

    return `fallback-${index}`;
  };

  private normalizarEstado(estado: string | null | undefined): EstadoSolicitud {
    const valor = (estado ?? 'nueva').toString().trim().toLowerCase();

    if (valor === 'en proceso') {
      return 'en_proceso';
    }

    if (valor === 'nueva' || valor === 'vista' || valor === 'en_proceso' || valor === 'asignada' || valor === 'cancelada') {
      return valor;
    }

    return 'nueva';
  }

  private getListaByTab(tab: TabAdmin): any[] {
    switch (tab) {
      case 'cuidadores':
        return this.cuidadores;
      case 'transportistas':
        return this.transportistas;
      case 'solicitudesCuidado':
        return this.solicitudesCuidado;
      case 'solicitudesTraslado':
        return this.solicitudesTraslado;
      default:
        return [];
    }
  }

  private refreshLista(tab: TabAdmin): void {
    switch (tab) {
      case 'cuidadores':
        this.cuidadores = [...this.cuidadores];
        break;
      case 'transportistas':
        this.transportistas = [...this.transportistas];
        break;
      case 'solicitudesCuidado':
        this.solicitudesCuidado = [...this.solicitudesCuidado];
        break;
      case 'solicitudesTraslado':
        this.solicitudesTraslado = [...this.solicitudesTraslado];
        break;
    }
  }

  private eliminarEnMemoria(tab: TabAdmin, idField: string, idValue: number | string): void {
    switch (tab) {
      case 'cuidadores':
        this.cuidadores = this.cuidadores.filter((item) => item[idField] !== idValue);
        break;
      case 'transportistas':
        this.transportistas = this.transportistas.filter((item) => item[idField] !== idValue);
        break;
      case 'solicitudesCuidado':
        this.solicitudesCuidado = this.solicitudesCuidado.filter((item) => item[idField] !== idValue);
        break;
      case 'solicitudesTraslado':
        this.solicitudesTraslado = this.solicitudesTraslado.filter((item) => item[idField] !== idValue);
        break;
    }
  }

  private obtenerIdRegistro(registro: any): { idField: string; idValue: number | string } {
    if (registro?.Id !== undefined && registro?.Id !== null) {
      return { idField: 'Id', idValue: registro.Id };
    }

    if (registro?.id !== undefined && registro?.id !== null) {
      return { idField: 'id', idValue: registro.id };
    }

    throw new Error('No se encontró un campo identificador (Id o id) en el registro.');
  }

  private limpiarMensajes(): void {
    this.errorMensaje = '';
    this.exitoMensaje = '';
  }
}
