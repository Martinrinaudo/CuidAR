import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-solicitud-empleada-domestica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitud-empleada-domestica.component.html',
  styleUrls: ['./solicitud-empleada-domestica.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolicitudEmpleadaDomesticaComponent {
  private fb = inject(FormBuilder);
  private formulariosService = inject(FormulariosService);
  private router = inject(Router);

  solicitudForm: FormGroup;
  mensaje: string = '';
  error: string = '';
  enviando: boolean = false;

  constructor() {
    this.solicitudForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      zona: ['', [Validators.required]],
      domicilio: ['', [Validators.required, Validators.minLength(5)]],
      descripcionTareas: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.solicitudForm.valid && !this.enviando) {
      this.enviando = true;
      this.error = '';
      this.mensaje = '';

      try {
        await this.formulariosService.crearSolicitudEmpleadaDomestica(this.solicitudForm.value);
        this.mensaje = '¡Solicitud enviada! Te vamos a contactar con candidatas disponibles.';
        this.solicitudForm.reset();
        this.enviando = false;

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      } catch (err) {
        this.error = 'Ocurrió un error al enviar la solicitud. Intentá nuevamente.';
        this.enviando = false;
        console.error('Error:', err);
      }
    } else {
      this.error = 'Por favor completa todos los campos correctamente.';
    }
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
