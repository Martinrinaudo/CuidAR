import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './home.component.css',
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <img src="assets/logo.png" alt="CuidAR Logo" class="hero-logo">
        <h1>Bienvenido a <span style="color:#6ee7b7">CuidAR</span></h1>
        <p class="hero-subtitle">
          Conectamos cuidadores profesionales y transportistas con familias
          que necesitan servicios de calidad para adultos mayores
        </p>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;height:80px">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>

    <!-- Servicios -->
    <section class="cards-section">
      <div class="section-label">
        <h2>¿Qué necesitás?</h2>
        <p>Elegí la opción que mejor se adapta a tu situación</p>
      </div>

      <div class="cards-grid">
        <div class="service-card card-green">
          <div class="card-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <polyline points="17 11 19 13 23 9"/>
            </svg>
          </div>
          <h3>Quiero ser cuidador</h3>
          <p>Únete a nuestra red de profesionales y ayuda a familias en tu zona</p>
          <a routerLink="/formularios/cuidador" class="btn btn-primary">Registrarme</a>
        </div>

        <div class="service-card card-amber">
          <div class="card-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <h3>Quiero ser transportista</h3>
          <p>Ofrecé servicios de traslado seguro y accesible para adultos mayores</p>
          <a routerLink="/formularios/transportista" class="btn btn-secondary">Registrarme</a>
        </div>

        <div class="service-card card-indigo">
          <div class="card-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <h3>Necesito una cuidadora</h3>
          <p>Solicitá una cuidadora profesional para tu familiar adulto mayor</p>
          <a routerLink="/formularios/solicitud-cuidado" class="btn btn-indigo">Solicitar</a>
        </div>

        <div class="service-card card-rose">
          <div class="card-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h3>Necesito un traslado</h3>
          <p>Organizá un traslado seguro y cómodo para tu familiar</p>
          <a routerLink="/formularios/solicitud-traslado" class="btn btn-rose">Solicitar</a>
        </div>
      </div>
    </section>

    <!-- Por qué elegirnos -->
    <section class="why-section">
      <div class="why-inner">
        <h2>¿Por qué elegir CuidAR?</h2>
        <div class="why-grid">
          <div class="why-item">
            <div class="why-icon">✓</div>
            <p>Profesionales verificados</p>
          </div>
          <div class="why-item">
            <div class="why-icon">❤</div>
            <p>Atención personalizada</p>
          </div>
          <div class="why-item">
            <div class="why-icon">⚡</div>
            <p>Sistema fácil y rápido</p>
          </div>
          <div class="why-item">
            <div class="why-icon">📍</div>
            <p>Cobertura regional</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer">
      <p>© 2025 <strong>CuidAR</strong> · Cuidado de adultos mayores en Argentina</p>
      <div class="admin-link-footer">
        <a routerLink="/admin/login">Acceso administrador →</a>
      </div>
    </footer>
  `
})
export class HomeComponent { }
