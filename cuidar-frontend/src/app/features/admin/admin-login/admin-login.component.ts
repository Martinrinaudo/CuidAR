import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private router = inject(Router);

  loginForm: FormGroup;
  error: string = '';
  enviando: boolean = false;

  constructor() {
    // Si ya está logueado, redirigir al panel
    if (this.adminService.isLoggedIn()) {
      this.router.navigate(['/admin/panel']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.enviando) {
      this.enviando = true;
      this.error = '';

      const { email, password } = this.loginForm.value;

      this.adminService.login(email, password).subscribe({
        next: () => {
          this.enviando = false;
          this.router.navigate(['/admin/panel']);
        },
        error: (err) => {
          this.error = 'Email o contraseña incorrectos';
          this.enviando = false;
          console.error('Error:', err);
        }
      });
    } else {
      this.error = 'Por favor completa todos los campos correctamente.';
    }
  }

  volverHome(): void {
    this.router.navigate(['/']);
  }
}
