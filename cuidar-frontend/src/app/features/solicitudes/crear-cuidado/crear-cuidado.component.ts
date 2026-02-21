import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudesService } from '../../../core/services/solicitudes.service';

@Component({
  selector: 'app-crear-cuidado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-cuidado.component.html',
  styleUrl: './crear-cuidado.component.css'
})
export class CrearCuidadoComponent {
  private fb = inject(FormBuilder);
  private solicitudesService = inject(SolicitudesService);
  private router = inject(Router);

  cuidadoForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor() {
    this.cuidadoForm = this.fb.group({
      nombreFamiliar: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      domicilio: ['', [Validators.required, Validators.minLength(5)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.cuidadoForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.cuidadoForm.value;
    
    // Convertir fechas a formato ISO con Z para UTC
    const dto = {
      nombreFamiliar: formValue.nombreFamiliar,
      descripcion: formValue.descripcion,
      domicilio: formValue.domicilio,
      fechaInicio: new Date(formValue.fechaInicio).toISOString(),
      fechaFin: new Date(formValue.fechaFin).toISOString()
    };

    this.solicitudesService.crearCuidado(dto).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Solicitud de cuidado creada exitosamente';
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
