import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudesService } from '../../../core/services/solicitudes.service';

@Component({
  selector: 'app-crear-traslado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-traslado.component.html',
  styleUrl: './crear-traslado.component.css'
})
export class CrearTrasladoComponent {
  private fb = inject(FormBuilder);
  private solicitudesService = inject(SolicitudesService);
  private router = inject(Router);

  trasladoForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor() {
    this.trasladoForm = this.fb.group({
      nombreFamiliar: ['', [Validators.required, Validators.minLength(3)]],
      origen: ['', [Validators.required, Validators.minLength(5)]],
      destino: ['', [Validators.required, Validators.minLength(5)]],
      fechaHora: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.trasladoForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.trasladoForm.value;
    
    // Convertir fecha a formato ISO con Z para UTC
    const dto = {
      nombreFamiliar: formValue.nombreFamiliar,
      origen: formValue.origen,
      destino: formValue.destino,
      fechaHora: new Date(formValue.fechaHora).toISOString()
    };

    this.solicitudesService.crearTraslado(dto).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Solicitud de traslado creada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error al crear solicitud. Intente nuevamente.';
        console.error('Error:', error);
      }
    });
  }
}
