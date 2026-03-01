import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormulariosService } from '../../../core/services/formularios.service';

@Component({
  selector: 'app-transportista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transportista.component.html',
  styleUrls: ['./transportista.component.css']
})
export class TransportistaComponent {
  private fb = inject(FormBuilder);
  private formulariosService = inject(FormulariosService);
  private router = inject(Router);

  transportistaForm: FormGroup;
  mensaje: string = '';
  error: string = '';
  enviando: boolean = false;

  constructor() {
    this.transportistaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      zonaCobertura: ['', [Validators.required]],
      tipoVehiculo: ['', [Validators.required]],
      aceptaSillaDeRuedas: [false],
      aceptaPagoParticular: [false]
    });
  }

  onSubmit(): void {
    if (this.transportistaForm.valid && !this.enviando) {
      this.enviando = true;
      this.error = '';
      this.mensaje = '';

      this.formulariosService.registrarTransportista(this.transportistaForm.value).subscribe({
        next: () => {
          this.mensaje = '¡Registro exitoso! Nos pondremos en contacto contigo pronto.';
          this.transportistaForm.reset();
          this.enviando = false;
          
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
