# Configuración del Panel de Administración

## Configurar Google OAuth en Supabase

### 1. Configurar credenciales de ambiente

Crea el archivo `src/environments/environment.ts` copiando el ejemplo:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Luego edita `environment.ts` con tus credenciales de Supabase:

```typescript
export const environment = {
  supabaseUrl: 'https://cvakzhgrnarlcvixhqzx.supabase.co',
  supabaseKey: 'TU_SUPABASE_ANON_KEY'
};
```

### 2. Habilitar Google OAuth en Supabase

1. Ve al [Dashboard de Supabase](https://app.supabase.com/project/cvakzhgrnarlcvixhqzx)
2. Navega a **Authentication > Providers**
3. Encuentra **Google** y haz clic en habilitar
4. Necesitarás crear credenciales OAuth en Google Cloud Console:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Ve a **APIs & Services > Credentials**
   - Crea **OAuth 2.0 Client ID**
   - Tipo de aplicación: **Web application**
   - URIs de redireccionamiento autorizados:
     - `https://cvakzhgrnarlcvixhqzx.supabase.co/auth/v1/callback`
   - Copia el **Client ID** y **Client Secret**
5. Regresa a Supabase y pega las credenciales de Google
6. Guarda los cambios

### 3. Configurar URLs permitidas en Supabase

1. En el Dashboard de Supabase, ve a **Authentication > URL Configuration**
2. En **Redirect URLs**, agrega:
   - `http://localhost:4200/admin/panel` (para desarrollo)
   - `https://cuid-ar-blush.vercel.app/admin/panel` (para producción)
3. En **Site URL**, configura:
   - `https://cuid-ar-blush.vercel.app`

### 4. Administradores autorizados

Los emails autorizados para acceder al panel admin están configurados en:
- **Backend**: `supabase/functions/admin/index.ts` - líneas 10-13
- Por defecto, solo estos emails tienen acceso:
  - martinrinaudo03@gmail.com
  - beatrizaraya123@gmail.com

Para agregar más administradores, edita el array `AUTHORIZED_ADMIN_EMAILS` en el archivo de la Edge Function.

### 5. Desplegar Edge Function (si hay cambios)

Si modificas la lista de administradores, necesitas redesplegar la Edge Function:

```bash
supabase functions deploy admin
```

## Desarrollo local

```bash
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## Autenticación

- El login usa **Google OAuth** a través de Supabase Auth
- Después de autenticarse con Google, el sistema verifica que el email esté en la lista de administradores autorizados
- Si el email no está autorizado, se deniega el acceso con un error 403
