# Guía de Configuración de Supabase - Nova E-Commerce

## Paso 1: Ejecutar el Script SQL

### 1.1 Acceder al SQL Editor

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com)
2. En el menú lateral izquierdo, haz clic en **SQL Editor** (ícono de código)
3. Haz clic en el botón **"New query"** o **"+ New Query"**

### 1.2 Ejecutar el Script

1. Abre el archivo `supabase-schema.sql` que se encuentra en la raíz del proyecto
2. Copia TODO el contenido del archivo
3. Pégalo en el editor SQL de Supabase
4. Haz clic en el botón **"Run"** (esquina inferior derecha)
5. Deberías ver un mensaje de éxito: "Success. No rows returned"

### 1.3 Verificar la Creación

Para verificar que todo se creó correctamente, ejecuta esta consulta:

```sql
-- Ver todas las tablas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Deberías ver:
- categorias
- productos
- ventas

---

## Paso 2: Configurar Storage para Imágenes

### 2.1 Crear el Bucket

1. En el menú lateral, haz clic en **Storage**
2. Haz clic en **"Create a new bucket"** o **"New bucket"**
3. Configuración del bucket:
   - **Name**: `productos-images`
   - **Public bucket**: ✅ **Activar** (marcar el checkbox)
   - **File size limit**: 5 MB (opcional)
   - **Allowed MIME types**: `image/*` (opcional, para solo permitir imágenes)
4. Haz clic en **"Create bucket"**

### 2.2 Configurar Políticas del Bucket

1. En la página de Storage, haz clic en tu bucket `productos-images`
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New policy"**

#### Política 1: Permitir Lectura Pública

1. Selecciona **"Custom"** o **"For full customization"**
2. Configuración:
   - **Policy name**: `Permitir lectura pública de imágenes`
   - **Allowed operation**: ☑️ **SELECT** (solo marcar SELECT)
   - **Policy definition**: Selecciona "**Allow access to everyone**"
3. Haz clic en **"Review"** y luego **"Save policy"**

#### Política 2: Permitir Subida para Autenticados

1. Haz clic en **"New policy"** nuevamente
2. Configuración:
   - **Policy name**: `Permitir subida para autenticados`
   - **Allowed operation**: ☑️ **INSERT** (marcar INSERT)
   - **Policy definition**: Selecciona "**Allow access to authenticated users only**"
3. Haz clic en **"Review"** y luego **"Save policy"**

#### Política 3: Permitir Eliminación para Autenticados

1. Haz clic en **"New policy"** una vez más
2. Configuración:
   - **Policy name**: `Permitir eliminación para autenticados`
   - **Allowed operation**: ☑️ **DELETE** (marcar DELETE)
   - **Policy definition**: Selecciona "**Allow access to authenticated users only**"
3. Haz clic en **"Review"** y luego **"Save policy"**

---

## Paso 3: Verificar Datos Iniciales

### 3.1 Ver Categorías Creadas

1. En el menú lateral, haz clic en **Table Editor**
2. Selecciona la tabla **"categorias"**
3. Deberías ver 10 categorías pre-cargadas:
   - Perfumes
   - Cremas Corporales
   - Cremas Faciales
   - Shampoo
   - Acondicionador
   - Jabones
   - Maquillaje
   - Cuidado de Manos
   - Cuidado de Pies
   - Otros

---

## Paso 4: Crear Usuario Administrador

### 4.1 Configurar Autenticación

1. En el menú lateral, haz clic en **Authentication**
2. Ve a la pestaña **"Users"**
3. Haz clic en **"Add user"** o **"Invite"**
4. Selecciona **"Create new user"**
5. Ingresa:
   - **Email**: tu correo (ej: admin@nova.com)
   - **Password**: una contraseña segura
   - **Auto Confirm User**: ✅ Activar (para no tener que confirmar email)
6. Haz clic en **"Create user"**

**Guarda estas credenciales**, las necesitarás para acceder al panel admin.

---

## Paso 5: Verificar Configuración en el Proyecto

### 5.1 Verificar Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_key_aqui
NEXT_PUBLIC_WHATSAPP_NUMBER=57XXXXXXXXX
```

### 5.2 Reiniciar el Servidor de Desarrollo

Si el servidor Next.js está corriendo:

1. Detén el servidor (Ctrl+C en la terminal)
2. Vuelve a iniciarlo: `npm run dev`

---

## Resumen de lo Configurado

### Base de Datos
✅ Tabla `categorias` con 10 categorías iniciales
✅ Tabla `productos` con validaciones y triggers
✅ Tabla `ventas` con control automático de inventario
✅ Índices para optimización de consultas
✅ Vistas para estadísticas

### Funcionalidades Automáticas
✅ **Validación de stock**: No permite vender si no hay suficiente stock
✅ **Resta automática**: El stock se reduce automáticamente al registrar una venta
✅ **Actualización de fechas**: Campo `updated_at` se actualiza automáticamente

### Seguridad (RLS)
✅ Los usuarios anónimos solo pueden ver productos activos
✅ Los usuarios autenticados (admin) pueden hacer todo
✅ Las imágenes son públicas pero solo admin puede subirlas/eliminarlas

### Storage
✅ Bucket `productos-images` creado
✅ Políticas configuradas para lectura pública y escritura autenticada

---

## Siguiente Paso

Una vez completada toda la configuración, estamos listos para:

**FASE 3 - SESIÓN 3: Componentes Base y UI con shadcn/ui**

Donde instalaremos los componentes de UI que usaremos en todo el proyecto.

---

## Solución de Problemas

### Error: "permission denied for schema public"
- Asegúrate de estar usando la anon key correcta
- Verifica que las políticas RLS estén creadas

### Error: "relation already exists"
- Algunas tablas ya existían, puedes ignorar este error
- O elimina las tablas manualmente desde Table Editor

### No puedo ver las imágenes
- Verifica que el bucket sea público
- Verifica que las políticas de lectura estén configuradas

### Error al subir imágenes
- Verifica que las políticas de INSERT estén configuradas
- Verifica que el bucket `productos-images` exista
