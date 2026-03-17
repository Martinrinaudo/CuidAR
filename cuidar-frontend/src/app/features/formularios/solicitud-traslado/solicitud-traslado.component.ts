import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-solicitud-traslado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitud-traslado.component.html',
  styleUrls: ['./solicitud-traslado.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolicitudTrasladoComponent {
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
      origen: ['', [Validators.required]],
      destino: ['', [Validators.required]],
      fechaHora: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.solicitudForm.valid && !this.enviando) {
      this.enviando = true;
      this.error = '';
      this.mensaje = '';

      // Convertir la fecha a formato UTC agregando Z al final
      const formData = { ...this.solicitudForm.value };
      if (formData.fechaHora && !formData.fechaHora.endsWith('Z')) {
        formData.fechaHora = formData.fechaHora + ':00Z';
      }

      try {
        await this.formulariosService.crearSolicitudTraslado(formData);
        this.mensaje = '¡Solicitud enviada exitosamente! Pronto te contactaremos para coordinar el traslado.';
        this.solicitudForm.reset();
        this.enviando = false;
        
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      } catch (err) {
        this.error = 'Ocurrió un error al enviar la solicitud. Por favor intenta de nuevo.';
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
