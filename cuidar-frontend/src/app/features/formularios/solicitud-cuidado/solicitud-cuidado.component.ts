import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-solicitud-cuidado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitud-cuidado.component.html',
  styleUrls: ['./solicitud-cuidado.component.css']
})
export class SolicitudCuidadoComponent {
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
      nombreFamiliar: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      zona: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.solicitudForm.valid && !this.enviando) {
      this.enviando = true;
      this.error = '';
      this.mensaje = '';

      this.formulariosService.crearSolicitudCuidado(this.solicitudForm.value).subscribe({
        next: () => {
          this.mensaje = '¡Solicitud enviada exitosamente! Pronto te contactaremos para coordinar.';
          this.solicitudForm.reset();
          this.enviando = false;
          
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          this.error = 'Ocurrió un error al enviar la solicitud. Por favor intenta de nuevo.';
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
