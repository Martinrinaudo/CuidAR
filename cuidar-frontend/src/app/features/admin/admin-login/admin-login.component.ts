import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { supabase } from '../../../core/supabase.client';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);

  email: string = '';
  error: string = '';
  mensajeExito: string = '';
  enviando: boolean = false;

  async ngOnInit() {
    // ✅ Detectar si Supabase está procesando un callback OAuth (hay hash en la URL)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      try {
        // Escuchar el cambio de estado de autenticación para redirigir cuando la sesión esté lista
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            // ✅ Limpiar el hash y redirigir cuando la sesión esté confirmada
            window.history.replaceState(null, '', window.location.pathname);
            authListener.subscription.unsubscribe();
            this.router.navigate(['/admin/panel']);
          }
        });
        return;
      } catch (err) {
        console.error('Error en callback OAuth:', err);
        this.error = 'Error al procesar la autenticación';
        return;
      }
    }

    // Verificar si ya hay una sesión activa (usuario vuelve a /admin/login)
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      this.router.navigate(['/admin/panel']);
      return;
    }
  }

  async login() {
    if (!this.enviando && this.email) {
      this.enviando = true;
      this.error = '';
      this.mensajeExito = '';

      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: this.email,
          options: {
            emailRedirectTo: 'https://cuid-ar-blush.vercel.app/admin/panel'
          }
        });

        if (error) {
          this.error = 'Error al enviar el email: ' + error.message;
        } else {
          this.mensajeExito = 'Revisá tu email, te enviamos un link de acceso';
        }
        this.enviando = false;
      } catch (err) {
        this.error = 'Error al enviar el link de acceso';
        this.enviando = false;
        console.error('Error:', err);
      }
    }
  }

  volverHome(): void {
    this.router.navigate(['/']);
  }
}
