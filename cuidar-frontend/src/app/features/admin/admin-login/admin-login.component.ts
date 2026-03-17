import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { supabase } from '../../../core/supabase.client';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginComponent implements OnInit {
  private router = inject(Router);

  error: string = '';
  mensajeExito: string = '';
  enviando: boolean = false;

  async ngOnInit() {
    // Detect OAuth callback (hash in URL)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      try {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
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

    // If already logged in, redirect
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      this.router.navigate(['/admin/panel']);
    }
  }

  async loginConGoogle(): Promise<void> {
    if (this.enviando) return;
    this.enviando = true;
    this.error = '';

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://cuid-ar-blush.vercel.app/admin/panel'
        }
      });
      if (error) {
        this.error = 'Error al iniciar sesión con Google: ' + error.message;
        this.enviando = false;
      }
      // On success, Supabase redirects the browser — no further action needed
    } catch (err) {
      this.error = 'Error al iniciar sesión';
      this.enviando = false;
      console.error('Error:', err);
    }
  }
}
