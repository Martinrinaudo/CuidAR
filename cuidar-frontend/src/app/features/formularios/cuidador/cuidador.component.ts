import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-cuidador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuidador.component.html',
  styleUrls: ['./cuidador.component.css']
})
export class CuidadorComponent {
  private fb = inject(FormBuilder);
  private formulariosService = inject(FormulariosService);
  private router = inject(Router);

  cuidadorForm: FormGroup;
  mensaje: string = '';
  error: string = '';
  enviando: boolean = false;

  constructor() {
    this.cuidadorForm = this.fb.group({
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
  }

  onSubmit(): void {
    if (this.cuidadorForm.valid && !this.enviando) {
      this.enviando = true;
      this.error = '';
      this.mensaje = '';

      this.formulariosService.registrarCuidador(this.cuidadorForm.value).subscribe({
        next: () => {
          this.mensaje = '¡Registro exitoso! Nos pondremos en contacto contigo pronto.';
          this.cuidadorForm.reset();
          this.enviando = false;
          
          // Opcional: redirigir después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          this.error = 'Ocurrió un error al enviar el formulario. Por favor intenta de nuevo.';
          this.enviando = false;
          console.error('Error:', err);
        }
      });
    } else {
      this.error = 'Por favor completa todos los campos correctamente.';
    }
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
