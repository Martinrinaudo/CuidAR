import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

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
  private supabaseService = inject(SupabaseService);

  error: string = '';
  mensajeExito: string = '';
  enviando: boolean = false;

  async ngOnInit(): Promise<void> {
    // Detect OAuth callback (hash in URL)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      try {
        const { data: authListener } = this.supabaseService.client.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            window.history.replaceState(null, '', window.location.pathname);
            authListener.subscription.unsubscribe();
            this.router.navigate(['/admin/panel']);
          }
        });
        return;
      } catch (err) {
        console.error('Error en callback OAuth:', err);
        this.error = this.supabaseService.formatError(err, 'Error al procesar la autenticación');
        return;
      }
    }

    // If already logged in, redirect
    try {
      const { data: { session } } = await this.supabaseService.safeGetSession();
      if (session) {
        this.router.navigate(['/admin/panel']);
      }
    } catch (err) {
      this.error = this.supabaseService.formatError(err, 'No se pudo validar la sesión.');
    }
  }

  // Rate limiting de sign-in: lo maneja Supabase Auth nativamente (no hay
  // Edge Function de login custom acá). Config: supabase/config.toml
  // [auth.rate_limit] sign_in_sign_ups, y en producción desde el dashboard
  // de Supabase en Authentication > Rate Limits.
  async loginConGoogle(): Promise<void> {
    if (this.enviando) return;
    this.enviando = true;
    this.error = '';

    try {
      const { error } = await this.supabaseService.client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://cuid-ar-blush.vercel.app/admin/panel'
        }
      });
      if (error) {
        this.error = this.supabaseService.formatError(error, 'Error al iniciar sesión con Google.');
        this.enviando = false;
      }
      // On success, Supabase redirects the browser — no further action needed
    } catch (err) {
      this.error = this.supabaseService.formatError(err, 'Error al iniciar sesión.');
      this.enviando = false;
      console.error('Error:', err);
    }
  }
}
