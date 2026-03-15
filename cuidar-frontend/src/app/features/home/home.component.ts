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
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <!-- Cuidador (persona joven) -->
              <circle cx="42" cy="28" r="14"/>
              <path d="M20 80 Q28 54 42 54 Q56 54 64 80Z"/>
              <!-- Adulto mayor con bastón -->
              <circle cx="82" cy="32" r="11"/>
              <path d="M65 84 Q72 58 82 58 Q90 58 96 72L92 84Z"/>
              <line x1="92" y1="68" x2="100" y2="90" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
              <!-- Corazón -->
              <path d="M52 48 C52 44 48 40 44 43 C40 40 36 44 36 48 C36 52 44 58 44 58 C44 58 52 52 52 48Z" opacity="0.6"/>
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
            <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <!-- Van/Ambulancia con rampa -->
              <rect x="5" y="30" width="75" height="44" rx="6"/>
              <rect x="80" y="42" width="32" height="32" rx="4"/>
              <rect x="12" y="36" width="28" height="20" rx="3" fill="rgba(255,255,255,0.35)"/>
              <rect x="44" y="36" width="24" height="20" rx="3" fill="rgba(255,255,255,0.35)"/>
              <!-- Ruedas -->
              <circle cx="25" cy="78" r="11" fill="rgba(0,0,0,.25)"/>
              <circle cx="25" cy="78" r="5"/>
              <circle cx="85" cy="78" r="11" fill="rgba(0,0,0,.25)"/>
              <circle cx="85" cy="78" r="5"/>
              <!-- Rampa -->
              <line x1="80" y1="74" x2="55" y2="96" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
              <line x1="75" y1="74" x2="50" y2="96" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
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
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <!-- Persona mayor sentada -->
              <circle cx="72" cy="26" r="13"/>
              <path d="M55 85 Q60 55 72 55 Q84 55 90 72L86 85Z"/>
              <!-- Silla -->
              <rect x="50" y="75" width="40" height="6" rx="3"/>
              <rect x="50" y="75" width="6" height="22" rx="3"/>
              <rect x="84" y="75" width="6" height="22" rx="3"/>
              <!-- Cuidadora (persona) -->
              <circle cx="32" cy="34" r="12"/>
              <path d="M16 86 Q22 60 32 60 Q42 60 48 78L44 86Z"/>
              <!-- Brazo apoyando -->
              <path d="M44 68 Q58 66 66 72" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/>
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
            <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <!-- Van accesible -->
              <rect x="5" y="28" width="80" height="46" rx="8"/>
              <rect x="85" y="40" width="28" height="34" rx="5"/>
              <rect x="12" y="34" width="30" height="22" rx="3" fill="rgba(255,255,255,0.3)"/>
              <rect x="46" y="34" width="26" height="22" rx="3" fill="rgba(255,255,255,0.3)"/>
              <!-- Ruedas -->
              <circle cx="28" cy="78" r="12" fill="rgba(0,0,0,.25)"/>
              <circle cx="28" cy="78" r="5"/>
              <circle cx="88" cy="78" r="12" fill="rgba(0,0,0,.25)"/>
              <circle cx="88" cy="78" r="5"/>
              <!-- Símbolo silla de ruedas -->
              <circle cx="110" cy="38" r="5"/>
              <path d="M107 44 L110 55 L118 55" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path d="M110 55 L107 65" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
              <circle cx="107" cy="68" r="4" fill="none" stroke="currentColor" stroke-width="3"/>
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
