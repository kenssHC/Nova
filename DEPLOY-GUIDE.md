# Guía de Deploy a Producción - Nova

Esta guía te llevará paso a paso para poner tu tienda virtual **Nova** en producción usando Vercel.

---

## Prerequisitos

Antes de comenzar, asegúrate de tener:

- [x] Proyecto funcionando localmente
- [x] Proyecto en Supabase configurado
- [x] Cuenta de GitHub (gratis)
- [x] Cuenta de Vercel (gratis) - Crear en [vercel.com](https://vercel.com)

---

## PASO 1: Preparar el Repositorio en GitHub

### 1.1. Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Click en el botón **"New"** (o "+" arriba a la derecha)
3. Nombra tu repositorio: `nova-ecommerce`
4. Deja como **Privado** (recomendado)
5. **NO** inicialices con README, .gitignore ni licencia
6. Click **"Create repository"**

### 1.2. Inicializar Git Localmente

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Crear primer commit
git commit -m "Initial commit: Nova e-commerce completo"

# Conectar con GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/nova-ecommerce.git

# Cambiar a rama main
git branch -M main

# Subir código a GitHub
git push -u origin main
```

**Importante:** Si te pide usuario y contraseña, necesitas usar un **Personal Access Token** en lugar de tu contraseña.

### 1.3. Crear Personal Access Token (si es necesario)

1. Ve a GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token → Classic
4. Dale un nombre: "Nova Deploy"
5. Selecciona: `repo` (todos los permisos de repositorio)
6. Generate token
7. **Copia el token** (solo se muestra una vez)
8. Úsalo como contraseña al hacer `git push`

### 1.4. Verificar Subida

Ve a tu repositorio en GitHub y verifica que todos los archivos estén ahí.

---

## PASO 2: Deploy en Vercel

### 2.1. Conectar Vercel con GitHub

1. Ve a [vercel.com](https://vercel.com)
2. Haz login o crea cuenta (puedes usar tu cuenta de GitHub)
3. Click en **"Add New..."** → **"Project"**
4. Autoriza a Vercel para acceder a tus repositorios de GitHub
5. Busca y selecciona tu repositorio `nova-ecommerce`
6. Click **"Import"**

### 2.2. Configurar el Proyecto

**Framework Preset:** Next.js (detectado automáticamente)

**Root Directory:** `./` (raíz del proyecto)

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**NO cambies nada aquí** a menos que sepas lo que haces.

### 2.3. Configurar Variables de Entorno

**MUY IMPORTANTE:** Antes de hacer deploy, click en **"Environment Variables"** y agrega:

#### Variables Requeridas:

| Name | Value | Where to Find |
|------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tu URL de Supabase | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu Anon Key de Supabase | Supabase → Project Settings → API |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `976575550` | Tu número de WhatsApp |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-proyecto.vercel.app` | Se asigna después del deploy |

**Cómo agregar:**
1. Escribe el nombre en "Key"
2. Pega el valor en "Value"
3. Asegúrate que esté seleccionado: Production, Preview, Development
4. Click **"Add"**
5. Repite para cada variable

**Nota:** `NEXT_PUBLIC_SITE_URL` la agregarás después del primer deploy.

### 2.4. Hacer Deploy

1. Una vez agregadas las variables de entorno
2. Click **"Deploy"**
3. Espera 2-3 minutos mientras Vercel construye tu proyecto
4. Verás logs en tiempo real del build

**Si todo sale bien:**
- ✅ Verás "Congratulations!" con confeti
- ✅ Te dará una URL: `https://nova-ecommerce-xxx.vercel.app`

**Si hay errores:**
- Lee los logs en rojo
- Verifica que las variables de entorno estén correctas
- Asegúrate que el código compile localmente con `npm run build`

---

## PASO 3: Configurar URL del Sitio

### 3.1. Agregar Variable NEXT_PUBLIC_SITE_URL

1. En Vercel, ve a tu proyecto
2. Settings → Environment Variables
3. Agrega una nueva variable:
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://tu-proyecto.vercel.app` (la URL que te dio Vercel)
   - Environments: Production, Preview, Development
4. Click **"Save"**

### 3.2. Re-deploy

1. Ve a la pestaña **"Deployments"**
2. Click en los 3 puntos del deployment más reciente
3. Click **"Redeploy"**
4. Click **"Redeploy"** de nuevo para confirmar

---

## PASO 4: Configurar Supabase para Producción

### 4.1. Agregar URL de Producción a Supabase

1. Ve a tu proyecto en Supabase
2. Settings → **URL Configuration**
3. En **"Site URL"**: Agrega tu URL de Vercel: `https://tu-proyecto.vercel.app`
4. En **"Redirect URLs"**: Agrega:
   - `https://tu-proyecto.vercel.app`
   - `https://tu-proyecto.vercel.app/admin`
   - `https://tu-proyecto.vercel.app/**`
5. Click **"Save"**

### 4.2. Configurar Políticas de CORS (si es necesario)

Supabase ya debería permitir requests desde tu dominio de Vercel, pero si tienes problemas:

1. Settings → API Settings
2. Verifica que CORS esté habilitado
3. Agrega tu dominio si no está

---

## PASO 5: Configurar Dominio Personalizado (Opcional)

### 5.1. Con Dominio Propio

Si tienes un dominio (ej: `www.nova-shop.com`):

1. En Vercel → Settings → **Domains**
2. Click **"Add"**
3. Ingresa tu dominio: `nova-shop.com` y `www.nova-shop.com`
4. Vercel te dará records DNS para configurar
5. Ve a tu proveedor de dominio (GoDaddy, Namecheap, etc.)
6. Agrega los records DNS que Vercel te indicó:
   - Tipo: **A** o **CNAME**
   - Host: **@** y **www**
   - Value: Lo que Vercel te indique
7. Espera 24-48 horas para propagación DNS
8. Vercel detectará automáticamente y activará SSL

### 5.2. Con Dominio Gratuito de Vercel

Por defecto ya tienes: `https://tu-proyecto.vercel.app`

Puedes cambiar el nombre del proyecto en Vercel:
1. Settings → General → Project Name
2. Cambia a algo más corto
3. Save
4. Tu URL cambiará a: `https://nuevo-nombre.vercel.app`

---

## PASO 6: Pruebas en Producción

### 6.1. Checklist de Pruebas

Abre tu URL de producción y verifica:

**Catálogo Público:**
- [ ] Página principal carga correctamente
- [ ] Se muestran los productos
- [ ] Búsqueda funciona
- [ ] Filtros por categoría funcionan
- [ ] Click en "Ver Detalles" abre producto
- [ ] Botón WhatsApp abre correctamente
- [ ] Botón flotante de WhatsApp funciona
- [ ] Footer se muestra correctamente

**Panel Admin:**
- [ ] `/admin` redirige a login
- [ ] Login funciona con tus credenciales
- [ ] Dashboard muestra estadísticas
- [ ] Crear producto funciona
- [ ] Subir imagen funciona
- [ ] Editar producto funciona
- [ ] Eliminar producto funciona
- [ ] Registrar venta funciona
- [ ] Stock se resta automáticamente
- [ ] Crear categoría funciona
- [ ] Gráficos se muestran correctamente

**SEO y Performance:**
- [ ] Título aparece en pestaña del navegador
- [ ] Favicon se muestra (si lo agregaste)
- [ ] Página carga rápido (< 3 segundos)
- [ ] Imágenes se optimizan automáticamente
- [ ] Página 404 personalizada funciona (prueba con `/asdf`)

### 6.2. Verificar Variables de Entorno

Si algo no funciona, verifica en Vercel:
1. Settings → Environment Variables
2. Todas las variables deben estar ahí
3. Los valores deben ser correctos
4. Si cambias algo, haz **Redeploy**

---

## PASO 7: Actualizar el Proyecto

### 7.1. Hacer Cambios Localmente

1. Haz cambios en tu código local
2. Prueba que funcione: `npm run dev`
3. Cuando esté listo:

```bash
git add .
git commit -m "Descripción de tus cambios"
git push
```

### 7.2. Deploy Automático

¡Vercel detecta automáticamente el push y hace deploy!

- Ve a Vercel → Deployments
- Verás un nuevo deployment en progreso
- Espera 2-3 minutos
- Tu sitio se actualiza automáticamente

**Branches:**
- `main` → Deploy a Producción
- Otras branches → Preview deployments

---

## PASO 8: Monitoreo y Mantenimiento

### 8.1. Analytics de Vercel

Vercel te da analytics gratis:
1. Ve a tu proyecto en Vercel
2. Analytics tab
3. Ve visitas, performance, etc.

### 8.2. Logs y Errores

Para ver errores en producción:
1. Vercel → Functions tab
2. Ve logs de las API routes
3. Debugging → Runtime Logs

### 8.3. Base de Datos

Monitorea Supabase:
1. Supabase → Database → Database Health
2. Ve uso de CPU, memoria, storage
3. Supabase tiene plan gratuito con límites

**Límites del Plan Gratuito:**
- 500 MB de database
- 1 GB de file storage
- 50,000 monthly active users
- 2 GB bandwidth

---

## PASO 9: Backups y Seguridad

### 9.1. Backups de Base de Datos

**Automáticos en Supabase:**
- Plan gratuito: Backups diarios por 7 días
- Para backups manuales:
  1. Supabase → Database → Backups
  2. Click "Download backup"

**Manual:**
```bash
# Exportar estructura y datos
pg_dump -h [supabase-host] -U postgres -d postgres > backup.sql
```

### 9.2. Seguridad

**Checklist de Seguridad:**
- [x] Variables de entorno en Vercel (no en código)
- [x] RLS (Row Level Security) habilitado en Supabase
- [x] HTTPS habilitado (automático en Vercel)
- [x] Headers de seguridad configurados
- [x] API Keys no expuestas en cliente
- [x] Autenticación en rutas admin

**Recomendaciones:**
- Cambia las contraseñas regularmente
- No compartas las API keys
- Monitorea logs de Supabase
- Actualiza dependencias: `npm audit`

---

## PASO 10: Optimizaciones Post-Deploy

### 10.1. Configurar Caching

Vercel ya hace caching automático, pero puedes optimizar:

**En `next.config.ts`:**
- Ya está configurado para optimizar imágenes
- Usa ISR (Incremental Static Regeneration) si quieres:

```typescript
export const revalidate = 3600 // Revalida cada hora
```

### 10.2. Lighthouse Audit

1. Abre tu sitio en Chrome
2. F12 → Lighthouse tab
3. Click "Analyze page load"
4. Ve tu score de Performance, SEO, Accessibility
5. Implementa sugerencias

### 10.3. Supabase Upgrade (si creces)

Si superas límites del plan gratuito:
- Supabase Pro: $25/mes
- Más storage, backups, mejor performance

---

## Comandos Útiles

```bash
# Ver estado de git
git status

# Ver cambios
git diff

# Crear nueva rama para features
git checkout -b feature/nueva-funcionalidad

# Merge a main
git checkout main
git merge feature/nueva-funcionalidad

# Ver logs de deployments en Vercel CLI
npx vercel logs

# Build local para probar producción
npm run build
npm run start

# Linter
npm run lint

# Actualizar dependencias
npm update

# Audit de seguridad
npm audit
npm audit fix
```

---

## Solución de Problemas Comunes

### Error: "Build failed"

**Causa:** Error de compilación o dependencias faltantes

**Solución:**
1. Ejecuta `npm run build` localmente
2. Corrige errores que aparezcan
3. Commit y push

### Error: "Environment variable missing"

**Causa:** Variables de entorno no configuradas en Vercel

**Solución:**
1. Vercel → Settings → Environment Variables
2. Agrega la variable faltante
3. Redeploy

### Error: "Supabase connection failed"

**Causa:** URL o keys incorrectas

**Solución:**
1. Verifica en Supabase → Settings → API
2. Copia exactamente la URL y anon key
3. Actualiza en Vercel
4. Redeploy

### Imágenes no cargan

**Causa:** Dominio de Supabase no permitido

**Solución:**
1. Verifica `next.config.ts`
2. Debe tener `**.supabase.co` en `remotePatterns`
3. Redeploy

### Botón WhatsApp no funciona

**Causa:** Variable `NEXT_PUBLIC_WHATSAPP_NUMBER` incorrecta

**Solución:**
1. Verifica el número: `976575550`
2. Sin + ni espacios
3. Actualiza en Vercel → Environment Variables
4. Redeploy

---

## Checklist Final de Deploy

Antes de considerar el deploy completo, verifica:

- [ ] Proyecto en GitHub
- [ ] Deploy exitoso en Vercel
- [ ] Variables de entorno configuradas
- [ ] URL de producción en Supabase
- [ ] Todas las funcionalidades probadas
- [ ] SEO metadata configurado
- [ ] Favicon agregado
- [ ] Páginas de error funcionan
- [ ] WhatsApp funciona
- [ ] Admin panel funciona
- [ ] Supabase conectado
- [ ] Imágenes cargan correctamente
- [ ] Performance aceptable

---

## Recursos Adicionales

**Documentación:**
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)

**Comunidades:**
- [Next.js Discord](https://nextjs.org/discord)
- [Supabase Discord](https://discord.supabase.com)

**Tutoriales:**
- [Deploy Next.js to Vercel](https://www.youtube.com/watch?v=yRz8D_oJMWQ)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

---

## ¡Felicidades! 🎉

Si llegaste hasta aquí y todo funciona, **¡tu tienda virtual Nova está en producción!**

**Próximos pasos sugeridos:**
1. Agrega productos reales con imágenes
2. Prueba el flujo completo de venta
3. Comparte la URL con tu cliente
4. Monitorea analytics y feedback
5. Itera y mejora basándote en uso real

**Recuerda:**
- El plan gratuito de Vercel y Supabase es suficiente para empezar
- Puedes upgradear cuando necesites más recursos
- Haz backups regulares de tu base de datos
- Mantén las dependencias actualizadas

---

**¿Necesitas ayuda?** Si tienes problemas, revisa:
1. Los logs en Vercel
2. Los logs en Supabase
3. La consola del navegador (F12)
4. Esta guía nuevamente

**¡Mucho éxito con tu tienda Nova!** 🚀
