import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormulariosService, TransportistaFormData } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-transportista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportistaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly formulariosService = inject(FormulariosService);
  private readonly router = inject(Router);

  readonly transportistaForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    zonaCobertura: ['', [Validators.required]],
    tipoVehiculo: ['', [Validators.required]],
    aceptaSillaDeRuedas: [false],
    aceptaPagoParticular: [false]
  });

  mensaje = '';
  error = '';
  enviando = false;

  private readonly formDefaults: TransportistaFormData = {
    nombre: '',
    email: '',
    telefono: '',
    zonaCobertura: '',
    tipoVehiculo: '',
    aceptaSillaDeRuedas: false,
    aceptaPagoParticular: false
  };

  async onSubmit(): Promise<void> {
    if (!this.transportistaForm.valid || this.enviando) {
      this.error = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.enviando = true;
    this.error = '';
    this.mensaje = '';

    try {
      await this.formulariosService.registrarTransportista(this.transportistaForm.getRawValue());
      this.mensaje = '¡Registro exitoso! Nos pondremos en contacto contigo pronto.';
      this.transportistaForm.reset(this.formDefaults);
      setTimeout(() => {
        void this.router.navigate(['/']);
      }, 3000);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Ocurrió un error al enviar el formulario. Por favor intenta de nuevo.';
      console.error('Error:', err);
    } finally {
      this.enviando = false;
    }
  }

  volver(): void {
    void this.router.navigate(['/']);
  }
}
