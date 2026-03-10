import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  error: string = '';
  enviando: boolean = false;

  async ngOnInit() {
    // Si ya está logueado, redirigir al panel
    const isLoggedIn = await this.adminService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/admin/panel']);
    }
  }

  loginWithGoogle(): void {
    if (!this.enviando) {
      this.enviando = true;
      this.error = '';

      this.adminService.login().subscribe({
        next: () => {
          // El redirect lo maneja Supabase
          this.enviando = false;
        },
        error: (err) => {
          this.error = 'Error al iniciar sesión con Google';
          this.enviando = false;
          console.error('Error:', err);
        }
      });
    }
  }

  volverHome(): void {
    this.router.navigate(['/']);
  }
}
