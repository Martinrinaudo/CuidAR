import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuidadoresService, Cuidador } from '../../../core/services/cuidadores.service';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent implements OnInit {
  private cuidadoresService = inject(CuidadoresService);

  cuidadores: Cuidador[] = [];
  zonaFiltro = '';
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.cargarCuidadores();
  }

  cargarCuidadores(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cuidadoresService.getAll(this.zonaFiltro || undefined).subscribe({
      next: (cuidadores) => {
        this.cuidadores = cuidadores;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al cargar los cuidadores';
        console.error('Error:', error);
      }
    });
  }

  filtrarPorZona(): void {
    this.cargarCuidadores();
  }
}
