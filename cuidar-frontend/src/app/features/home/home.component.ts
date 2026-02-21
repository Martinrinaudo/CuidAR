import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './home.component.css',
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>Bienvenido a CuidAR</h1>
        <p class="subtitle">Conectamos cuidadores profesionales y transportistas con familias que necesitan servicios de calidad para adultos mayores</p>
      </div>

      <div class="cards-section">
        <div class="card card-cuidador">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
          <h2>Quiero ser cuidador</h2>
          <p>Únete a nuestra red de profesionales y ayuda a familias en tu zona</p>
          <a routerLink="/formularios/cuidador" class="btn btn-primary">Registrarme</a>
        </div>

        <div class="card card-transportista">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <h2>Quiero ser transportista</h2>
          <p>Ofrece servicios de transporte seguro para adultos mayores</p>
          <a routerLink="/formularios/transportista" class="btn btn-secondary">Registrarme</a>
        </div>

        <div class="card card-solicitud-cuidado">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <h2>Necesito una cuidadora</h2>
          <p>Solicita una cuidadora profesional para tu familiar</p>
          <a routerLink="/formularios/solicitud-cuidado" class="btn btn-purple">Solicitar</a>
        </div>

        <div class="card card-solicitud-traslado">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="2" x2="12" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h2>Necesito un traslado</h2>
          <p>Organiza un traslado seguro para tu familiar</p>
          <a routerLink="/formularios/solicitud-traslado" class="btn btn-pink">Solicitar</a>
        </div>
      </div>

      <div class="admin-link">
        <a routerLink="/admin/login">Acceso administrador →</a>
      </div>

      <div class="info-section">
        <h2>¿Por qué elegir CuidAR?</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-icon">✓</span>
            <p>Profesionales verificados</p>
          </div>
          <div class="info-item">
            <span class="info-icon">✓</span>
            <p>Atención personalizada</p>
          </div>
          <div class="info-item">
            <span class="info-icon">✓</span>
            <p>Sistema fácil y rápido</p>
          </div>
          <div class="info-item">
            <span class="info-icon">✓</span>
            <p>Cobertura regional</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent { }
