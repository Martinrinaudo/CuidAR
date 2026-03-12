import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from '../../../core/supabase.client';

interface Cuidador {
  id?: number;
  Nombre: string;
  Email: string;
  Telefono: string;
  Experiencia: string;
  ZonaCobertura: string;
  Horario?: string;
  Dias?: string;
  Referencias?: string;
  Vehiculo?: boolean;
  FechaEnvio?: string;
}

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent implements OnInit {
  cuidadores: Cuidador[] = [];
  zonaFiltro = '';
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.cargarCuidadores();
  }

  async cargarCuidadores(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      let query = supabase.from('RegistrosCuidadores').select('*');
      
      if (this.zonaFiltro) {
        query = query.ilike('ZonaCobertura', `%${this.zonaFiltro}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      this.cuidadores = data || [];
    } catch (error) {
      this.errorMessage = 'Error al cargar los cuidadores';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  filtrarPorZona(): void {
    this.cargarCuidadores();
  }
}
