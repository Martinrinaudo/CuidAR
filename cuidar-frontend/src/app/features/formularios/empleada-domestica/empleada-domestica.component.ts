import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmpleadaDomesticaFormData, FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-empleada-domestica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './empleada-domestica.component.html',
  styleUrls: ['./empleada-domestica.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpleadaDomesticaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly formulariosService = inject(FormulariosService);
  private readonly router = inject(Router);

  readonly postulacionForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    diasDisponibles: ['', [Validators.required]],
    zona: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]]
  });

  mensaje = '';
  error = '';
  enviando = false;

  private readonly formDefaults: EmpleadaDomesticaFormData = {
    nombre: '',
    email: '',
    telefono: '',
    diasDisponibles: '',
    zona: '',
    descripcion: ''
  };

  async onSubmit(): Promise<void> {
    if (!this.postulacionForm.valid || this.enviando) {
      this.error = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.enviando = true;
    this.error = '';
    this.mensaje = '';

    try {
      await this.formulariosService.registrarEmpleadaDomestica(this.postulacionForm.getRawValue());
      this.mensaje = '¡Postulación enviada! Te contactaremos en breve.';
      this.postulacionForm.reset(this.formDefaults);
      setTimeout(() => {
        void this.router.navigate(['/']);
      }, 3000);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Ocurrió un error al enviar la postulación. Intentá nuevamente.';
      console.error('Error:', err);
    } finally {
      this.enviando = false;
    }
  }

  volver(): void {
    void this.router.navigate(['/']);
  }
}
