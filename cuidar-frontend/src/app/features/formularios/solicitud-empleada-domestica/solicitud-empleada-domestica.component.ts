import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormulariosService, SolicitudEmpleadaDomesticaFormData } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-solicitud-empleada-domestica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitud-empleada-domestica.component.html',
  styleUrls: ['./solicitud-empleada-domestica.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolicitudEmpleadaDomesticaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly formulariosService = inject(FormulariosService);
  private readonly router = inject(Router);

  readonly solicitudForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    zona: ['', [Validators.required]],
    domicilio: ['', [Validators.required, Validators.minLength(5)]],
    descripcionTareas: ['', [Validators.required, Validators.minLength(10)]]
  });

  mensaje = '';
  error = '';
  enviando = false;

  private readonly formDefaults: SolicitudEmpleadaDomesticaFormData = {
    nombre: '',
    email: '',
    telefono: '',
    zona: '',
    domicilio: '',
    descripcionTareas: ''
  };

  async onSubmit(): Promise<void> {
    if (!this.solicitudForm.valid || this.enviando) {
      this.error = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.enviando = true;
    this.error = '';
    this.mensaje = '';

    try {
      await this.formulariosService.crearSolicitudEmpleadaDomestica(this.solicitudForm.getRawValue());
      this.mensaje = '¡Solicitud enviada! Te vamos a contactar con candidatas disponibles.';
      this.solicitudForm.reset(this.formDefaults);
      setTimeout(() => {
        void this.router.navigate(['/']);
      }, 3000);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Ocurrió un error al enviar la solicitud. Intenta nuevamente.';
      console.error('Error:', err);
    } finally {
      this.enviando = false;
    }
  }

  volver(): void {
    void this.router.navigate(['/']);
  }
}
