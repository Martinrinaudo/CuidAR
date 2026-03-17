# CuidAR - Plataforma de Cuidadores y Transportistas 🏥

CuidAR es una plataforma web moderna desarrollada en **Angular 17+** que conecta familias con cuidadores calificados y servicios de transporte médico seguro en Argentina.

## 🚀 Tecnologías Usadas
- **Frontend Framework:** Angular 17+ (Standalone Components)
- **Backend as a Service (BaaS):** Supabase (Auth & Postgres Database)
- **Hosting / Deployment:** Vercel
- **Testing:** Vitest

## 📋 Requisitos Previos
- Node.js (v18.x o superior)
- npm (v9.x o superior)
- Cuenta en Supabase
- Angular CLI (`npm install -g @angular/cli`)

## ⚙️ Instalación y Desarrollo Local

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd cuidar-frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configuración de Variables de Entorno (Supabase):**
   Debes actualizar los archivos de entorno con las credenciales de tu proyecto Supabase.
   
   En `src/environments/environment.ts` y `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: false, // true en environment.prod.ts
     supabaseUrl: 'TU_SUPABASE_URL',
     supabaseAnonKey: 'TU_SUPABASE_ANON_KEY'
   };
   ```

4. **Levantar el servidor de desarrollo:**
   ```bash
   npm start
   # o
   ng serve
   ```
   Abre [http://localhost:4200/](http://localhost:4200/) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/          # Servicios fundamentales, Guards e Interceptores
│   ├── features/      # Módulos de la aplicación (Home, Formularios, Admin)
│   └── shared/        # Componentes reutilizables (Navbar, Footer, Utilidades)
├── assets/            # Imágenes, íconos y otros archivos estáticos
└── environments/      # Variables de configuración por entorno
```

## 🛡️ Seguridad y Buenas Prácticas
- **ChangeDetectionStrategy.OnPush:** Optimización de renderizado en componentes.
- **CSP & Security Headers:** Implementado en `vercel.json` para bloquear ataques XSS y Clickjacking.
- **Supabase RLS:** Asegúrate de tener activado *Row Level Security* en tus tablas de Supabase en producción para proteger los datos.

## 🛠️ Comandos Útiles

- **Construir para producción:** `npm run build` o `ng build --configuration production`
- **Ejecutar tests unitarios (Vitest):** `npm test`
- **Auditar dependencias:** `npm audit`

## ☁️ Deploy en Vercel
1. Conecta tu cuenta de GitHub/GitLab a Vercel.
2. Importa este repositorio.
3. El framework preset de Vercel detectará automáticamente **Angular**.
4. ¡Haz deploy! Vercel leerá el archivo `vercel.json` para configurar el routing y los headers de seguridad correspondientes automáticamente.

---
*Desarrollado para CuidAR.*
