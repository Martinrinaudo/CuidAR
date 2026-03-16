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

        <!-- Cuidador -->
        <a routerLink="/formularios/cuidador" class="big-card card-bg-green">
          <div class="big-card-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <!-- Persona con bastón (adulto mayor) -->
              <circle cx="25" cy="20" r="8"/>
              <path d="M 25 30 L 25 50 M 25 35 L 18 45 M 25 35 L 32 45 M 25 50 L 20 70 M 25 50 L 30 70"/>
              <path d="M 15 55 L 15 70" stroke="currentColor" stroke-width="2" fill="none"/>
              
              <!-- Cuidador -->
              <circle cx="55" cy="20" r="8"/>
              <path d="M 55 30 L 55 50 M 55 35 L 48 45 M 55 35 L 62 45 M 55 50 L 50 70 M 55 50 L 60 70"/>
            </svg>
          </div>
          <div class="big-card-body">
            <h3>Quiero ser Cuidador</h3>
            <p>Únete a nuestra red de cuidadores calificados</p>
            <span class="big-card-btn">Registrarse como Cuidador</span>
          </div>
        </a>

        <!-- Transportista -->
        <a routerLink="/formularios/transportista" class="big-card card-bg-amber">
          <div class="big-card-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <!-- Camión -->
              <rect x="15" y="40" width="45" height="30" rx="3"/>
              <rect x="60" y="50" width="25" height="20" rx="2"/>
              <rect x="20" y="25" width="25" height="15" rx="2"/>
              <circle cx="30" cy="75" r="6"/>
              <circle cx="70" cy="75" r="6"/>
              <path d="M 45 25 L 50 35 L 60 35 L 60 50" stroke="currentColor" stroke-width="1.5" fill="none"/>
            </svg>
          </div>
          <div class="big-card-body">
            <h3>Quiero ser Transportista</h3>
            <p>Ofrece traslados seguros y cómodos</p>
            <span class="big-card-btn">Registrarse como Transportista</span>
          </div>
        </a>

        <!-- Solicitud Cuidado -->
        <a routerLink="/formularios/solicitud-cuidado" class="big-card card-bg-indigo">
          <div class="big-card-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <!-- Cuidadora de pie -->
              <circle cx="30" cy="20" r="8"/>
              <path d="M 30 30 L 30 50 M 30 35 L 23 45 M 30 35 L 37 45 M 30 50 L 25 70 M 30 50 L 35 70"/>
              
              <!-- Persona en silla/cama -->
              <circle cx="65" cy="35" r="7"/>
              <rect x="50" y="50" width="30" height="4" rx="2"/>
              <path d="M 65 43 L 65 50" stroke="currentColor" fill="none"/>
              <rect x="48" y="50" width="4" height="15"/>
              <rect x="78" y="50" width="4" height="15"/>
            </svg>
          </div>
          <div class="big-card-body">
            <h3>Necesito una Cuidadora</h3>
            <p>Encuentra la mejor atención para tus familiares</p>
            <span class="big-card-btn">Buscar Cuidadora</span>
          </div>
        </a>

        <!-- Solicitud Traslado -->
        <a routerLink="/formularios/solicitud-traslado" class="big-card card-bg-rose">
          <div class="big-card-icon">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <!-- Van/Ambulancia -->
              <rect x="20" y="45" width="60" height="25" rx="4"/>
              <rect x="25" y="30" width="30" height="15" rx="2"/>
              <circle cx="35" cy="75" r="6"/>
              <circle cx="70" cy="75" r="6"/>
              
              <!-- Cruz médica -->
              <rect x="60" y="50" width="3" height="12" fill="#df6469" />
              <rect x="56" y="54" width="11" height="3" fill="#df6469" />
              
              <!-- Ventanas -->
              <rect x="28" y="35" width="8" height="8" fill="rgba(255,255,255,0.3)"/>
              <rect x="40" y="35" width="8" height="8" fill="rgba(255,255,255,0.3)"/>
            </svg>
          </div>
          <div class="big-card-body">
            <h3>Necesito un Traslado</h3>
            <p>Solicita traslados médicos o recreativos</p>
            <span class="big-card-btn">Solicitar Traslado</span>
          </div>
        </a>

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
