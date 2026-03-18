# Configuración del Panel de Administración

## Configurar Google OAuth en Supabase

### 1. Habilitar Google OAuth en Supabase

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

### 2. Configurar URLs permitidas en Supabase

1. En el Dashboard de Supabase, ve a **Authentication > URL Configuration**
2. En **Redirect URLs**, agrega:
   - `http://localhost:4200/admin/panel` (para desarrollo)
   - `https://cuid-ar-blush.vercel.app/admin/panel` (para producción)
3. En **Site URL**, configura:
   - `https://cuid-ar-blush.vercel.app`

### 3. Administradores autorizados y CORS (Edge Functions)

La autorización del panel admin ahora se configura por variables de entorno en Supabase (no hardcodeada en código):

- `ADMIN_EMAILS`: emails admin separados por coma.
   - Ejemplo: `martinrinaudo03@gmail.com,beatrizaraya123@gmail.com`
- `ALLOWED_ORIGINS`: orígenes permitidos separados por coma.
   - Ejemplo: `https://cuid-ar-blush.vercel.app,http://localhost:4200`

Si estas variables no están configuradas, la función responderá error de configuración.

### 4. Configurar secrets y desplegar Edge Functions

Configura los secrets en Supabase (una sola vez o cuando cambien):

```bash
supabase secrets set ADMIN_EMAILS="martinrinaudo03@gmail.com,beatrizaraya123@gmail.com"
supabase secrets set ALLOWED_ORIGINS="https://cuid-ar-blush.vercel.app,http://localhost:4200"
```

Luego despliega funciones:

Si modificas administradores u orígenes, debes volver a desplegar:

```bash
supabase functions deploy admin
supabase functions deploy formularios
```

### 5. Aplicar políticas RLS (obligatorio para producción)

Se agregó una migración de seguridad en:

- `supabase/migrations/20260318_security_rls.sql`

Aplica la migración:

```bash
supabase db push
```

La migración hace lo siguiente:

- Crea `public.admin_users`
- Activa RLS en tablas de formularios
- Permite solo inserts públicos necesarios
- Restringe select/update/delete a admins autenticados
- Inserta admins iniciales (idempotente)

Si quieres agregar un admin nuevo:

```sql
insert into public.admin_users (email) values ('nuevoadmin@dominio.com')
on conflict (email) do nothing;
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
