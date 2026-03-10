import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { supabase } from '../../../core/supabase.client';

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
    // Intentar intercambiar el código de la URL por una sesión
    if (window.location.search) {
      try {
        const { data } = await supabase.auth.exchangeCodeForSession(
          window.location.search
        );
        if (data.session) {
          console.log('Sesión obtenida del código:', data.session);
          this.router.navigate(['/admin/panel']);
          return;
        }
      } catch (error) {
        console.error('Error al intercambiar código:', error);
      }
    }
    
    // Verificar si ya hay sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log('Session en login:', session); // Debug
    
    // Si hay sesión activa, redirigir al panel
    if (session) {
      console.log('Redirigiendo al panel admin');
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
