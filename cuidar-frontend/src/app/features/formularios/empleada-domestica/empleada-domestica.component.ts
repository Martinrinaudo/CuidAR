import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-empleada-domestica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './empleada-domestica.component.html',
  styleUrls: ['./empleada-domestica.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmpleadaDomesticaComponent {
  private fb = inject(FormBuilder);
  private formulariosService = inject(FormulariosService);
  private router = inject(Router);

  postulacionForm: FormGroup;
  mensaje: string = '';
  error: string = '';
  enviando: boolean = false;

  constructor() {
    this.postulacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      diasDisponibles: ['', [Validators.required]],
      zona: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.postulacionForm.valid && !this.enviando) {
      this.enviando = true;
      this.error = '';
      this.mensaje = '';

      try {
        await this.formulariosService.registrarEmpleadaDomestica(this.postulacionForm.value);
        this.mensaje = '¡Postulación enviada! Te contactaremos en breve.';
        this.postulacionForm.reset();
        this.enviando = false;

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      } catch (err) {
        this.error = 'Ocurrió un error al enviar la postulación. Intentá nuevamente.';
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
