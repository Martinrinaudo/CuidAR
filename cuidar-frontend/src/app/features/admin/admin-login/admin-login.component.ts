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
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      this.router.navigate(['/admin/panel']);
      return;
    }
  }

  async loginWithGoogle() {
    if (!this.enviando) {
      this.enviando = true;
      this.error = '';

      try {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'https://cuid-ar-blush.vercel.app/admin/panel'
          }
        });
        this.enviando = false;
      } catch (err) {
        this.error = 'Error al iniciar sesión con Google';
        this.enviando = false;
        console.error('Error:', err);
      }
    }
  }

  volverHome(): void {
    this.router.navigate(['/']);
  }
}
