import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './home.component.css',
  template: `
    <div class="min-h-screen bg-[#fbfaf6] font-sans">
      <!-- Hero -->
      <section class="w-full bg-gradient-to-b from-[#e6f4ea] to-[#fbfaf6] pt-20 pb-16 text-center">
        <div class="max-w-6xl mx-auto px-6">
          <h1 class="text-4xl md:text-5xl font-extrabold text-[#184a32] mb-4 tracking-tight">Bienvenido a CuidAR</h1>
          <p class="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Cuidado integral para tus seres queridos en Argentina
          </p>
          <div class="flex justify-center mb-4">
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 10 Q 15 0, 30 10 T 60 10" stroke="#184a32" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- Cards Grid -->
      <section class="max-w-6xl mx-auto px-6 pb-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Cuidador -->
          <a routerLink="/formularios/cuidador" class="h-64 rounded-[40px] bg-[#1a4d32] p-10 flex flex-col justify-between text-left text-white no-underline transition-transform hover:-translate-y-1 hover:shadow-xl group">
            <!-- Icon -->
            <div class="w-16 h-16 text-white/90">
              <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full">
                <circle cx="42" cy="28" r="14"/>
                <path d="M20 80 Q28 54 42 54 Q56 54 64 80Z"/>
                <circle cx="82" cy="32" r="11"/>
                <path d="M65 84 Q72 58 82 58 Q90 58 96 72L92 84Z"/>
                <line x1="92" y1="68" x2="100" y2="90" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                <path d="M52 48 C52 44 48 40 44 43 C40 40 36 44 36 48 C36 52 44 58 44 58 C44 58 52 52 52 48Z" opacity="0.6"/>
              </svg>
            </div>
            <!-- Content -->
            <div class="flex flex-col gap-2">
              <h3 class="text-[1.35rem] font-bold mb-0 leading-tight">Quiero ser Cuidador</h3>
              <p class="text-sm text-white/80 leading-snug mb-3">Únete a nuestra red de cuidadores calificados</p>
              <span class="bg-white/20 backdrop-blur-md rounded-full px-5 py-2 w-fit text-[0.85rem] font-bold text-white transition-colors group-hover:bg-white/30">Registrarse como Cuidador</span>
            </div>
          </a>

          <!-- Transportista -->
          <a routerLink="/formularios/transportista" class="h-64 rounded-[40px] bg-[#d4a24c] p-10 flex flex-col justify-between text-left text-gray-900 no-underline transition-transform hover:-translate-y-1 hover:shadow-xl group">
            <div class="w-16 h-16 text-gray-900/80">
              <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full">
                <rect x="5" y="30" width="75" height="44" rx="6"/>
                <rect x="80" y="42" width="32" height="32" rx="4"/>
                <rect x="12" y="36" width="28" height="20" rx="3" fill="rgba(255,255,255,0.4)"/>
                <rect x="44" y="36" width="24" height="20" rx="3" fill="rgba(255,255,255,0.4)"/>
                <circle cx="25" cy="78" r="11" fill="rgba(0,0,0,.2)"/>
                <circle cx="25" cy="78" r="5"/>
                <circle cx="85" cy="78" r="11" fill="rgba(0,0,0,.2)"/>
                <circle cx="85" cy="78" r="5"/>
                <line x1="80" y1="74" x2="55" y2="96" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
                <line x1="75" y1="74" x2="50" y2="96" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="flex flex-col gap-2">
              <h3 class="text-[1.35rem] font-bold mb-0 leading-tight">Quiero ser Transportista</h3>
              <p class="text-sm text-gray-900/70 leading-snug mb-3">Ofrece traslados seguros y cómodos</p>
              <span class="bg-white/30 backdrop-blur-md rounded-full px-5 py-2 w-fit text-[0.85rem] font-bold text-gray-900 transition-colors group-hover:bg-white/40">Registrarse como Transportista</span>
            </div>
          </a>

          <!-- Solicitud Cuidado -->
          <a routerLink="/formularios/solicitud-cuidado" class="h-64 rounded-[40px] bg-[#5865c3] p-10 flex flex-col justify-between text-left text-white no-underline transition-transform hover:-translate-y-1 hover:shadow-xl group">
            <div class="w-16 h-16 text-white/80">
              <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full">
                <circle cx="72" cy="26" r="13"/>
                <path d="M55 85 Q60 55 72 55 Q84 55 90 72L86 85Z"/>
                <rect x="50" y="75" width="40" height="6" rx="3"/>
                <rect x="50" y="75" width="6" height="22" rx="3"/>
                <rect x="84" y="75" width="6" height="22" rx="3"/>
                <circle cx="32" cy="34" r="12"/>
                <path d="M16 86 Q22 60 32 60 Q42 60 48 78L44 86Z"/>
                <path d="M44 68 Q58 66 66 72" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="flex flex-col gap-2">
              <h3 class="text-[1.35rem] font-bold mb-0 leading-tight">Necesito una Cuidadora</h3>
              <p class="text-sm text-white/80 leading-snug mb-3">Encuentra la mejor atención para tus familiares</p>
              <span class="bg-white/20 backdrop-blur-md rounded-full px-5 py-2 w-fit text-[0.85rem] font-bold text-white transition-colors group-hover:bg-white/30">Buscar Cuidadora</span>
            </div>
          </a>

          <!-- Solicitud Traslado -->
          <a routerLink="/formularios/solicitud-traslado" class="h-64 rounded-[40px] bg-[#e1535e] p-10 flex flex-col justify-between text-left text-white no-underline transition-transform hover:-translate-y-1 hover:shadow-xl group">
            <div class="w-16 h-16 text-white/90">
              <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-full h-full">
                <rect x="5" y="28" width="80" height="46" rx="8"/>
                <rect x="85" y="40" width="28" height="34" rx="5"/>
                <rect x="12" y="34" width="30" height="22" rx="3" fill="rgba(255,255,255,0.3)"/>
                <rect x="46" y="34" width="26" height="22" rx="3" fill="rgba(255,255,255,0.3)"/>
                <circle cx="28" cy="78" r="12" fill="rgba(0,0,0,.2)"/>
                <circle cx="28" cy="78" r="5"/>
                <circle cx="88" cy="78" r="12" fill="rgba(0,0,0,.2)"/>
                <circle cx="88" cy="78" r="5"/>
                <circle cx="110" cy="38" r="5"/>
                <path d="M107 44 L110 55 L118 55" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M110 55 L107 65" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
                <circle cx="107" cy="68" r="4" fill="none" stroke="currentColor" stroke-width="3"/>
              </svg>
            </div>
            <div class="flex flex-col gap-2">
              <h3 class="text-[1.35rem] font-bold mb-0 leading-tight">Necesito un Traslado</h3>
              <p class="text-sm text-white/80 leading-snug mb-3">Solicita traslados médicos o recreativos</p>
              <span class="bg-white/20 backdrop-blur-md rounded-full px-5 py-2 w-fit text-[0.85rem] font-bold text-white transition-colors group-hover:bg-white/30">Solicitar Traslado</span>
            </div>
          </a>

        </div>
      </section>
    </div>
  `
})
export class HomeComponent { }
