import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-crear-cuidado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-cuidado.component.html',
  styleUrl: './crear-cuidado.component.css'
})
export class CrearCuidadoComponent {
  private fb = inject(FormBuilder);
  private formulariosService = inject(FormulariosService);
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

  async onSubmit(): Promise<void> {
    if (this.cuidadoForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.cuidadoForm.value;
    
    const dto = {
      nombre: formValue.nombreFamiliar,
      email: '',
      telefono: '',
      nombreFamiliar: formValue.nombreFamiliar,
      descripcion: formValue.descripcion,
      zona: formValue.domicilio
    };

    try {
      await this.formulariosService.crearSolicitudCuidado(dto);
      this.loading = false;
      this.successMessage = 'Solicitud de cuidado creada exitosamente';
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);
    } catch (error: any) {
      this.loading = false;
      this.errorMessage = error.message || 'Error al crear solicitud. Intente nuevamente.';
      console.error('Error:', error);
    }
  }
}
