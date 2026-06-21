# CuidAR - Backend Completo

Sistema de plataforma para conectar cuidadores de personas mayores con familias.

## ? Arquitectura Implementada

### Características Principales
- **Formularios públicos** sin autenticación para cualquier usuario
- **Panel de admin** con autenticación JWT
- **Stack**: .NET 8 Web API + EF Core 8 + PostgreSQL (Supabase)

---

## ?? Estructura del Proyecto

### Models/
- **Admin.cs** - Administrador del sistema
- **RegistroCuidador.cs** - Formulario de registro de cuidadores
- **RegistroTransportista.cs** - Formulario de registro de transportistas
- **SolicitudCuidado.cs** - Solicitud de servicio de cuidado
- **SolicitudTraslado.cs** - Solicitud de servicio de traslado

### DTO/
- **AdminLoginDTO.cs** - Login del admin
- **RegistroCuidadorDTO.cs**
- **RegistroTransportistaDTO.cs**
- **SolicitudCuidadoDTO.cs**
- **SolicitudTrasladoDTO.cs**

### Controllers/
- **FormulariosController.cs** - Endpoints públicos (sin autenticación)
  - `POST /api/formularios/cuidador`
  - `POST /api/formularios/transportista`
  - `POST /api/formularios/solicitud-cuidado`
  - `POST /api/formularios/solicitud-traslado`

- **AdminController.cs** - Endpoints protegidos (requieren JWT)
  - `POST /api/admin/login` (sin autenticación)
  - `GET /api/admin/cuidadores`
  - `GET /api/admin/transportistas`
  - `GET /api/admin/solicitudes-cuidado`
  - `GET /api/admin/solicitudes-traslado`

### Data/
- **AppDbContext.cs** - DbContext con mapeo UTC automático
- **AppDbContextFactory.cs** - Factory para migraciones

---

## ?? Cómo Ejecutar

### 1. Verificar Connection String
El `appsettings.json` ya tiene tu connection string de Supabase configurado.

### 2. Base de Datos
La base de datos ya está creada y migrada. Si necesitas recrearla:
```bash
dotnet ef database drop --force
dotnet ef database update
```

### 3. Ejecutar la Aplicación
```bash
dotnet run
```

La app arranca en `http://localhost:5033` (o el puerto que muestre en consola).

### 4. Acceder a Swagger
Abrí tu navegador en: `http://localhost:5033/swagger`

---

## ?? Credenciales del Admin

El admin se crea automáticamente al iniciar la app:

- **Email**: `admin@cuidar.com`
- **Password**: `Admin1234.`

### Para usar endpoints protegidos en Swagger:
1. Hacé POST a `/api/admin/login` con las credenciales
2. Copiá el `token` que devuelve
3. Clic en el botón **Authorize** (arriba a la derecha en Swagger)
4. Pegá: `Bearer {tu-token-aquí}`
5. Ahora podés acceder a los endpoints GET de `/api/admin/*`

---

## ?? Tablas en la Base de Datos

- `Admins`
- `RegistrosCuidadores`
- `RegistrosTransportistas`
- `SolicitudesCuidado`
- `SolicitudesTraslado`

Todas las fechas se almacenan en **UTC** automáticamente.

---

## ?? CORS

Configurado para permitir peticiones desde:
- `http://localhost:4200` (Angular)

Para agregar más orígenes, editá `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:4200", "https://tu-otro-dominio.com")
```

---

## ??? Paquetes NuGet Instalados

- `Npgsql.EntityFrameworkCore.PostgreSQL` 8.0.4
- `Microsoft.EntityFrameworkCore.Design` 8.0.4
- `BCrypt.Net-Next` 4.1.0
- `Microsoft.AspNetCore.Authentication.JwtBearer` 8.0.4
- `Swashbuckle.AspNetCore` 6.6.2

---

## ? Archivos Creados/Modificados

### ? Creados:
- `Models/Admin.cs`
- `Models/RegistroCuidador.cs`
- `Models/RegistroTransportista.cs`
- `Models/SolicitudCuidado.cs`
- `Models/SolicitudTraslado.cs`
- `DTO/AdminLoginDTO.cs`
- `DTO/RegistroCuidadorDTO.cs`
- `DTO/RegistroTransportistaDTO.cs`
- `DTO/SolicitudCuidadoDTO.cs`
- `DTO/SolicitudTrasladoDTO.cs`
- `Controllers/FormulariosController.cs`
- `Controllers/AdminController.cs`
- `Migrations/20260221211416_InitialCreate.cs`

### ? Modificados:
- `Data/AppDbContext.cs` - Nuevo esquema con DateTime UTC
- `Program.cs` - Seed del admin + Swagger con JWT

### ? Eliminados (sistema antiguo):
- `Models/Usuario.cs`, `Cuidador.cs`, `Postulacion.cs`, `Enums.cs`
- `DTO/UsuarioDTO.cs`, `CuidadorDTO.cs`, `SolicitudDTO.cs`
- `Controllers/UsuariosController.cs`, `CuidadoresController.cs`, `SolicitudesController.cs`
- Migraciones antiguas

---

## ?? Próximos Pasos

1. **Probá los endpoints en Swagger**
2. **Conectá tu frontend Angular** apuntando a `http://localhost:5033`
3. **Verificá que los formularios públicos funcionen sin token**
4. **Probá el login del admin y los endpoints protegidos**

---

## ?? Deploy en Railway

Este proyecto está listo para deploy en Railway. Seguí las instrucciones en [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md).

### Variables de Entorno Requeridas
- `DATABASE_URL` - Connection string de PostgreSQL
- `JWT_KEY` - Clave secreta para JWT
- `ALLOWED_ORIGINS` - Orígenes permitidos para CORS (opcional)

Ver `.env.example` para más detalles.

¡Todo listo para empezar a usar CuidAR! ??

