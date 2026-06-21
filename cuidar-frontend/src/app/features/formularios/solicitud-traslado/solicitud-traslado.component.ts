import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormulariosService, SolicitudTrasladoFormData } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-solicitud-traslado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitud-traslado.component.html',
  styleUrls: ['./solicitud-traslado.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolicitudTrasladoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly formulariosService = inject(FormulariosService);
  private readonly router = inject(Router);

  readonly solicitudForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    nombreFamiliar: ['', [Validators.required, Validators.minLength(3)]],
    origen: ['', [Validators.required]],
    destino: ['', [Validators.required]],
    fechaHora: ['', [Validators.required]]
  });

  mensaje = '';
  error = '';
  enviando = false;

  private readonly formDefaults: SolicitudTrasladoFormData = {
    nombre: '',
    email: '',
    telefono: '',
    nombreFamiliar: '',
    origen: '',
    destino: '',
    fechaHora: ''
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
      await this.formulariosService.crearSolicitudTraslado(this.solicitudForm.getRawValue());
      this.mensaje = '¡Solicitud enviada exitosamente! Pronto te contactaremos para coordinar el traslado.';
      this.solicitudForm.reset(this.formDefaults);
      setTimeout(() => {
        void this.router.navigate(['/']);
      }, 3000);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Ocurrió un error al enviar la solicitud. Por favor intenta de nuevo.';
      console.error('Error:', err);
    } finally {
      this.enviando = false;
    }
  }

  volver(): void {
    void this.router.navigate(['/']);
  }
}
