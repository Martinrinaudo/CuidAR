import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CuidadorFormData, FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-cuidador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cuidador.component.html',
  styleUrls: ['./cuidador.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuidadorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly formulariosService = inject(FormulariosService);
  private readonly router = inject(Router);

  readonly cuidadorForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    experiencia: ['', [Validators.required, Validators.minLength(10)]],
    zonaCobertura: ['', [Validators.required]],
    vehiculo: [false],
    referencias: ['', [Validators.required, Validators.minLength(10)]],
    horario: ['', [Validators.required]],
    dias: ['', [Validators.required]]
  });

  mensaje = '';
  error = '';
  enviando = false;

  private readonly formDefaults: CuidadorFormData = {
    nombre: '',
    email: '',
    telefono: '',
    experiencia: '',
    zonaCobertura: '',
    vehiculo: false,
    referencias: '',
    horario: '',
    dias: ''
  };

  async onSubmit(): Promise<void> {
    if (!this.cuidadorForm.valid || this.enviando) {
      this.error = 'Por favor completa todos los campos correctamente.';
      return;
    }

    this.enviando = true;
    this.error = '';
    this.mensaje = '';

    try {
      await this.formulariosService.registrarCuidador(this.cuidadorForm.getRawValue());
      this.mensaje = '¡Registro exitoso! Nos pondremos en contacto contigo pronto.';
      this.cuidadorForm.reset(this.formDefaults);
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
