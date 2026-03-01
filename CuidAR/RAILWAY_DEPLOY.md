# Deploy CuidAR en Railway

## ?? Variables de Entorno Requeridas

Configurá estas variables en el dashboard de Railway:

### 1. **DATABASE_URL**
El connection string de tu base de datos PostgreSQL (Supabase).

Formato:
```
Host=db.xxxxx.supabase.co;Database=postgres;Username=postgres;Password=TU_PASSWORD;Port=5432;SSL Mode=Prefer;Trust Server Certificate=true
```

### 2. **JWT_KEY**
La clave secreta para firmar los tokens JWT.

Ejemplo:
```
CuidAR_SuperSecretKey_2026_XYZ789!
```

### 3. **ALLOWED_ORIGINS** (Opcional)
Los orígenes permitidos para CORS, separados por comas.

Ejemplo:
```
https://tu-frontend.vercel.app,https://cuidar.com
```

Si no se configura, por defecto permite `http://localhost:4200`

---

## ?? Pasos para Deploy en Railway

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Conectá tu repositorio**
   - Andá a [Railway](https://railway.app)
   - Click en "New Project"
   - Seleccioná "Deploy from GitHub repo"
   - Elegí tu repositorio `CuidAR`

2. **Configurá las variables de entorno**
   - En el dashboard del proyecto, andá a "Variables"
   - Agregá las 3 variables mencionadas arriba

3. **Configurá el Root Directory**
   - En Settings ? Root Directory, poné: `CuidAR`
   - Esto le dice a Railway que tu proyecto está en la carpeta CuidAR

4. **Deploy automático**
   - Railway detectará el Dockerfile y hará el build automáticamente
   - Esperá a que termine el deploy (puede tardar 2-5 minutos)

5. **Verificá el deploy**
   - Railway te dará una URL pública (ej: `https://cuidar-production.up.railway.app`)
   - Probá accediendo a: `https://tu-url.railway.app/swagger`

### Opción 2: Deploy con Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Agregar variables de entorno
railway variables set DATABASE_URL="tu-connection-string"
railway variables set JWT_KEY="tu-jwt-key"
railway variables set ALLOWED_ORIGINS="https://tu-frontend.com"

# Deploy
railway up
```

---

## ?? Verificación Post-Deploy

1. **Migraciones automáticas**: El código ya tiene configurado `context.Database.Migrate()` en el startup, así que las migraciones se aplicarán automáticamente.

2. **Admin seed**: El admin con credenciales `admin@cuidar.com` / `Admin1234.` se creará automáticamente si no existe.

3. **Testear endpoints**:
   - GET `https://tu-url.railway.app/swagger` ? Ver documentación
   - POST `https://tu-url.railway.app/api/admin/login` ? Probar login del admin

---

## ?? Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- Verificá que configuraste la variable en Railway
- Asegurate que el nombre sea exactamente `DATABASE_URL` (case-sensitive)

### Error: "JWT_KEY environment variable is not set"
- Verificá que configuraste la variable `JWT_KEY` en Railway

### Error de CORS
- Agregá la URL de tu frontend en la variable `ALLOWED_ORIGINS`
- Ejemplo: `https://cuidar-frontend.vercel.app`

### Las migraciones no se aplican
- Revisá los logs en Railway para ver si hay errores de conexión a la DB
- Verificá que el connection string sea correcto

---

## ?? Notas Importantes

- **Puerto**: Railway automáticamente asigna un puerto a través de la variable `PORT`. El código ya está configurado para leerla.
- **HTTPS**: Railway provee HTTPS automáticamente en todas las URLs públicas.
- **Logs**: Podés ver los logs en tiempo real en el dashboard de Railway.
- **Reiniciar**: Si cambiás variables de entorno, necesitás hacer redeploy (Railway lo hace automáticamente).

---

## ?? Seguridad

?? **NUNCA** hagas commit de los siguientes archivos con valores reales:
- `appsettings.json` con connection strings o secrets
- `.env` files

Los valores sensibles están ahora en variables de entorno y `appsettings.json` solo tiene placeholders vacíos.
