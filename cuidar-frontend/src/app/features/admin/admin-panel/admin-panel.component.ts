import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminPagedResult, EstadoSolicitud } from '../../../core/services/admin.service';

type TabAdmin =
  | 'cuidadores'
  | 'transportistas'
  | 'solicitudesCuidado'
  | 'solicitudesTraslado'
  | 'empleadasDomesticas'
  | 'solicitudesEmpleadaDomestica';

interface EstadoOption {
  value: EstadoSolicitud;
  label: string;
}

interface TablaConfig {
  key: TabAdmin;
  tableName: string;
  labelSingular: string;
}

interface PaginacionTab {
  page: number;
  total: number;
  loaded: boolean;
  loading: boolean;
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
  private cdr = inject(ChangeDetectorRef);
  private readonly PAGE_SIZE = 25;

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
  empleadasDomesticas: any[] = [];
  solicitudesEmpleadaDomestica: any[] = [];

  private readonly paginacionMap: Record<TabAdmin, PaginacionTab> = {
    cuidadores: { page: 1, total: 0, loaded: false, loading: false },
    transportistas: { page: 1, total: 0, loaded: false, loading: false },
    solicitudesCuidado: { page: 1, total: 0, loaded: false, loading: false },
    solicitudesTraslado: { page: 1, total: 0, loaded: false, loading: false },
    empleadasDomesticas: { page: 1, total: 0, loaded: false, loading: false },
    solicitudesEmpleadaDomestica: { page: 1, total: 0, loaded: false, loading: false }
  };

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
    },
    empleadasDomesticas: {
      key: 'empleadasDomesticas',
      tableName: 'RegistrosEmpleadasDomesticas',
      labelSingular: 'postulacion de empleada domestica'
    },
    solicitudesEmpleadaDomestica: {
      key: 'solicitudesEmpleadaDomestica',
      tableName: 'SolicitudesEmpleadaDomestica',
      labelSingular: 'solicitud de empleada domestica'
    }
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  cambiarTab(tab: TabAdmin): void {
    this.tabActiva = tab;
    this.filtroEstado = 'todas';
    this.limpiarMensajes();

    if (!this.paginacionMap[tab].loaded) {
      void this.cargarTab(tab, 1);
      return;
    }

    this.cdr.detectChanges();
  }

  async cargarDatos(): Promise<void> {
    await this.cargarTab(this.tabActiva, 1);
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

  getTotalRegistros(tab: TabAdmin): number {
    return this.paginacionMap[tab].total;
  }

  getPaginaActual(tab: TabAdmin): number {
    return this.paginacionMap[tab].page;
  }

  getTotalPaginas(tab: TabAdmin): number {
    const total = this.paginacionMap[tab].total;
    return Math.max(1, Math.ceil(total / this.PAGE_SIZE));
  }

  puedeIrPaginaAnterior(tab: TabAdmin): boolean {
    return !this.paginacionMap[tab].loading && this.getPaginaActual(tab) > 1;
  }

  puedeIrPaginaSiguiente(tab: TabAdmin): boolean {
    return !this.paginacionMap[tab].loading && this.getPaginaActual(tab) < this.getTotalPaginas(tab);
  }

  async irPaginaAnterior(tab: TabAdmin): Promise<void> {
    if (!this.puedeIrPaginaAnterior(tab)) {
      return;
    }

    await this.cargarTab(tab, this.getPaginaActual(tab) - 1);
  }

  async irPaginaSiguiente(tab: TabAdmin): Promise<void> {
    if (!this.puedeIrPaginaSiguiente(tab)) {
      return;
    }

    await this.cargarTab(tab, this.getPaginaActual(tab) + 1);
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
      this.cdr.detectChanges();
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

      const paginacion = this.paginacionMap[tab];
      paginacion.total = Math.max(0, paginacion.total - 1);

      const listaActual = this.getListaByTab(tab);
      if (listaActual.length === 0 && paginacion.page > 1) {
        await this.cargarTab(tab, paginacion.page - 1);
      }

      this.exitoMensaje = 'Registro eliminado correctamente.';
    } catch (err) {
      this.errorMensaje = 'No se pudo eliminar el registro.';
      console.error('Error al eliminar registro:', err);
    } finally {
      this.procesando = false;
      this.cdr.detectChanges();
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
      case 'empleadasDomesticas':
        return this.empleadasDomesticas;
      case 'solicitudesEmpleadaDomestica':
        return this.solicitudesEmpleadaDomestica;
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
      case 'empleadasDomesticas':
        this.empleadasDomesticas = [...this.empleadasDomesticas];
        break;
      case 'solicitudesEmpleadaDomestica':
        this.solicitudesEmpleadaDomestica = [...this.solicitudesEmpleadaDomestica];
        break;
    }
  }

  private async cargarTab(tab: TabAdmin, page: number): Promise<void> {
    this.limpiarMensajes();
    this.cargando = true;
    this.paginacionMap[tab].loading = true;

    try {
      const resultado = await this.obtenerPagina(tab, page);
      const listaNormalizada = resultado.data.map((item) => ({
        ...item,
        estado: this.normalizarEstado(item?.estado)
      }));

      this.paginacionMap[tab].page = resultado.page;
      this.paginacionMap[tab].total = resultado.total;
      this.paginacionMap[tab].loaded = true;

      switch (tab) {
        case 'cuidadores':
          this.cuidadores = listaNormalizada;
          break;
        case 'transportistas':
          this.transportistas = listaNormalizada;
          break;
        case 'solicitudesCuidado':
          this.solicitudesCuidado = listaNormalizada;
          break;
        case 'solicitudesTraslado':
          this.solicitudesTraslado = listaNormalizada;
          break;
        case 'empleadasDomesticas':
          this.empleadasDomesticas = listaNormalizada;
          break;
        case 'solicitudesEmpleadaDomestica':
          this.solicitudesEmpleadaDomestica = listaNormalizada;
          break;
      }
    } catch (err) {
      console.error(`Error al cargar datos de ${tab}:`, err);
      this.errorMensaje = 'No se pudieron cargar los registros del panel.';
    } finally {
      this.cargando = false;
      this.paginacionMap[tab].loading = false;
      this.cdr.detectChanges();
    }
  }

  private async obtenerPagina(tab: TabAdmin, page: number): Promise<AdminPagedResult<any>> {
    switch (tab) {
      case 'cuidadores':
        return this.adminService.getCuidadores(page, this.PAGE_SIZE);
      case 'transportistas':
        return this.adminService.getTransportistas(page, this.PAGE_SIZE);
      case 'solicitudesCuidado':
        return this.adminService.getSolicitudesCuidado(page, this.PAGE_SIZE);
      case 'solicitudesTraslado':
        return this.adminService.getSolicitudesTraslado(page, this.PAGE_SIZE);
      case 'empleadasDomesticas':
        return this.adminService.getEmpleadasDomesticas(page, this.PAGE_SIZE);
      case 'solicitudesEmpleadaDomestica':
        return this.adminService.getSolicitudesEmpleadaDomestica(page, this.PAGE_SIZE);
      default:
        return { data: [], total: 0, page: 1, pageSize: this.PAGE_SIZE };
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
      case 'empleadasDomesticas':
        this.empleadasDomesticas = this.empleadasDomesticas.filter((item) => item[idField] !== idValue);
        break;
      case 'solicitudesEmpleadaDomestica':
        this.solicitudesEmpleadaDomestica = this.solicitudesEmpleadaDomestica.filter((item) => item[idField] !== idValue);
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
