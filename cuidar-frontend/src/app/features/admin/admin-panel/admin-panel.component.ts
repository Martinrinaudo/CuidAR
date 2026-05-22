import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPagedResult, AdminRecord, AdminService, EstadoSolicitud } from '../../../core/services/admin.service';

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
  private readonly adminService = inject(AdminService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly pageSize = 25;

  tabActiva: TabAdmin = 'cuidadores';
  cargando = false;
  procesando = false;
  filtroEstado: 'todas' | EstadoSolicitud = 'todas';
  errorMensaje = '';
  exitoMensaje = '';

  cuidadores: AdminRecord[] = [];
  transportistas: AdminRecord[] = [];
  solicitudesCuidado: AdminRecord[] = [];
  solicitudesTraslado: AdminRecord[] = [];
  empleadasDomesticas: AdminRecord[] = [];
  solicitudesEmpleadaDomestica: AdminRecord[] = [];

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
    void this.cargarDatos();
  }

  cambiarTab(tab: TabAdmin): void {
    this.tabActiva = tab;
    this.filtroEstado = 'todas';
    this.limpiarMensajes();

    if (!this.paginacionMap[tab].loaded) {
      void this.cargarTab(tab, 1);
      return;
    }

    this.cdr.markForCheck();
  }

  onFiltroEstadoChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      this.errorMensaje = 'No se pudo actualizar el filtro de estado.';
      return;
    }

    const value = target.value;
    this.filtroEstado = value === 'todas' ? 'todas' : this.normalizarEstado(value);
    this.cdr.markForCheck();
  }

  async cargarDatos(): Promise<void> {
    await this.cargarTab(this.tabActiva, 1);
  }

  async cerrarSesion(): Promise<void> {
    try {
      await this.adminService.logout();
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      this.errorMensaje = err instanceof Error ? err.message : 'No se pudo cerrar la sesión.';
      this.cdr.markForCheck();
    }
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) {
      return 'N/A';
    }

    const date = new Date(fecha);
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString('es-AR');
  }

  getEstadoLabel(estado: string | null | undefined): string {
    const estadoNormalizado = this.normalizarEstado(estado);
    return this.estadoOptions.find((option) => option.value === estadoNormalizado)?.label ?? 'Nueva';
  }

  getEstadoClase(estado: string | null | undefined): string {
    switch (this.normalizarEstado(estado)) {
      case 'vista':
        return 'badge-success';
      case 'en_proceso':
        return 'badge-warning';
      case 'asignada':
        return 'badge-info';
      case 'cancelada':
        return 'badge-danger';
      case 'nueva':
      default:
        return 'badge-secondary';
    }
  }

  getRegistrosFiltrados(tab: TabAdmin): AdminRecord[] {
    const lista = this.getListaByTab(tab);
    if (this.filtroEstado === 'todas') {
      return lista;
    }

    return lista.filter((item) => this.normalizarEstado(item.estado) === this.filtroEstado);
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
    return Math.max(1, Math.ceil(total / this.pageSize));
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

  async cambiarEstado(tab: TabAdmin, registro: AdminRecord, event: Event): Promise<void> {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      this.errorMensaje = 'No se pudo leer el nuevo estado.';
      return;
    }

    const nuevoEstado = this.normalizarEstado(target.value);
    const estadoAnterior = this.normalizarEstado(registro.estado);
    const idData = this.obtenerIdRegistro(registro);

    this.limpiarMensajes();
    registro.estado = nuevoEstado;
    this.procesando = true;

    try {
      const tabla = this.tablaConfigMap[tab];
      await this.adminService.actualizarEstado(tabla.tableName, idData.idField, idData.idValue, nuevoEstado);
      this.exitoMensaje = `Estado actualizado a ${this.getEstadoLabel(nuevoEstado)}.`;
    } catch (err) {
      registro.estado = estadoAnterior;
      this.errorMensaje = err instanceof Error ? err.message : 'No se pudo actualizar el estado. Intenta nuevamente.';
      console.error('Error al actualizar estado:', err);
    } finally {
      this.procesando = false;
      this.cdr.markForCheck();
    }
  }

  async eliminar(tab: TabAdmin, registro: AdminRecord): Promise<void> {
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
      this.errorMensaje = err instanceof Error ? err.message : 'No se pudo eliminar el registro.';
      console.error('Error al eliminar registro:', err);
    } finally {
      this.procesando = false;
      this.cdr.markForCheck();
    }
  }

  trackByRegistro = (_index: number, item: AdminRecord): string | number => {
    const idValue = item.Id ?? item.id;
    if (idValue !== undefined && idValue !== null) {
      return idValue;
    }

    return _index;
  };

  private normalizarEstado(estado: string | null | undefined): EstadoSolicitud {
    const valor = (estado ?? 'nueva').toString().trim().toLowerCase();

    if (valor === 'en proceso') {
      return 'en_proceso';
    }

    if (
      valor === 'nueva' ||
      valor === 'vista' ||
      valor === 'en_proceso' ||
      valor === 'asignada' ||
      valor === 'cancelada'
    ) {
      return valor;
    }

    return 'nueva';
  }

  private getListaByTab(tab: TabAdmin): AdminRecord[] {
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
    }
  }

  private setListaByTab(tab: TabAdmin, lista: AdminRecord[]): void {
    switch (tab) {
      case 'cuidadores':
        this.cuidadores = lista;
        break;
      case 'transportistas':
        this.transportistas = lista;
        break;
      case 'solicitudesCuidado':
        this.solicitudesCuidado = lista;
        break;
      case 'solicitudesTraslado':
        this.solicitudesTraslado = lista;
        break;
      case 'empleadasDomesticas':
        this.empleadasDomesticas = lista;
        break;
      case 'solicitudesEmpleadaDomestica':
        this.solicitudesEmpleadaDomestica = lista;
        break;
    }
  }

  private async cargarTab(tab: TabAdmin, page: number): Promise<void> {
    this.limpiarMensajes();
    this.cargando = true;
    this.paginacionMap[tab].loading = true;

    try {
      const resultado = await this.obtenerPagina(tab, page);
      const listaNormalizada: AdminRecord[] = resultado.data.map((item) => ({
        ...item,
        estado: this.normalizarEstado(item.estado)
      }));

      this.paginacionMap[tab].page = resultado.page;
      this.paginacionMap[tab].total = resultado.total;
      this.paginacionMap[tab].loaded = true;
      this.setListaByTab(tab, listaNormalizada);
    } catch (err) {
      console.error(`Error al cargar datos de ${tab}:`, err);
      this.errorMensaje = err instanceof Error ? err.message : 'No se pudieron cargar los registros del panel.';
    } finally {
      this.cargando = false;
      this.paginacionMap[tab].loading = false;
      this.cdr.markForCheck();
    }
  }

  private async obtenerPagina(tab: TabAdmin, page: number): Promise<AdminPagedResult> {
    switch (tab) {
      case 'cuidadores':
        return this.adminService.getCuidadores(page, this.pageSize);
      case 'transportistas':
        return this.adminService.getTransportistas(page, this.pageSize);
      case 'solicitudesCuidado':
        return this.adminService.getSolicitudesCuidado(page, this.pageSize);
      case 'solicitudesTraslado':
        return this.adminService.getSolicitudesTraslado(page, this.pageSize);
      case 'empleadasDomesticas':
        return this.adminService.getEmpleadasDomesticas(page, this.pageSize);
      case 'solicitudesEmpleadaDomestica':
        return this.adminService.getSolicitudesEmpleadaDomestica(page, this.pageSize);
    }
  }

  private eliminarEnMemoria(tab: TabAdmin, idField: string, idValue: number | string): void {
    const lista = this.getListaByTab(tab).filter((item) => item[idField] !== idValue);
    this.setListaByTab(tab, lista);
  }

  private obtenerIdRegistro(registro: AdminRecord): { idField: string; idValue: number | string } {
    if (registro.Id !== undefined && registro.Id !== null) {
      return { idField: 'Id', idValue: registro.Id };
    }

    if (registro.id !== undefined && registro.id !== null) {
      return { idField: 'id', idValue: registro.id };
    }

    throw new Error('No se encontró un campo identificador (Id o id) en el registro.');
  }

  private limpiarMensajes(): void {
    this.errorMensaje = '';
    this.exitoMensaje = '';
  }
}
