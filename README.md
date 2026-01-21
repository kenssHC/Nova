# Nova - E-Commerce de Perfumería y Cuidado Personal

Sistema de tienda virtual para gestión de productos, ventas y análisis de ganancias.

## Colores de Marca

- **Brown**: `#b08e6b`
- **Gold**: `#e8c39e`
- **Cream**: `#f5e1ce`
- **Wine**: `#96305a`
- **Pink**: `#ca678e`

## Stack Tecnológico

- **Frontend**: Next.js 15 + TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Gráficos**: Recharts
- **Deploy**: Vercel

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Copiar .env.local.example a .env.local y llenar las credenciales

# Ejecutar en desarrollo
npm run dev
```

## Variables de Entorno Requeridas

Crear archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_WHATSAPP_NUMBER=976575550
```

## Estructura del Proyecto

```
/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── admin/             # Panel de administración
│   └── page.tsx           # Página principal (catálogo)
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
├── types/                 # Tipos de TypeScript
└── public/                # Archivos estáticos
```

## Funcionalidades

### Catálogo Público
- Visualización de productos
- Filtros por categoría
- Búsqueda
- Integración con WhatsApp para compras

### Panel Administrativo
- CRUD de productos
- Gestión de inventario
- Registro de ventas
- Dashboard con estadísticas de ganancias
- Gráficos de análisis

## Fases de Desarrollo

- [x] Fase 1 - Sesión 1: Setup inicial del proyecto
- [x] Fase 2 - Sesión 2: Configuración Supabase
- [x] Fase 3 - Sesión 3: Componentes base y UI
- [x] Fase 4 - Sesión 4: API Routes - Backend
- [x] Fase 5 - Sesión 6: Sistema de autenticación
- [x] Fase 5 - Sesión 7: CRUD de Productos
- [x] Fase 5 - Sesión 8: Gestión de ventas e inventario
- [x] Fase 5 - Sesión 9: Dashboard con gráficos (Recharts)
- [x] Fase 6 - Sesión 10: Página principal - Catálogo
- [x] Fase 6 - Sesión 11: Integración WhatsApp
- [x] Fase 7 - Sesión 12: Inventario automático
- [x] Fase 7 - Sesión 13: Gestión de categorías
- [x] Fase 8 - Sesión 14: Optimizaciones y Deploy

## Deploy a Producción

Ver guía completa en: **[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)**

Pasos principales:
1. Subir código a GitHub
2. Conectar con Vercel
3. Configurar variables de entorno
4. Deploy automático
5. Configurar dominio (opcional)

## Comandos Disponibles

```bash
npm run dev      # Ejecutar en desarrollo
npm run build    # Construir para producción
npm run start    # Ejecutar versión de producción
npm run lint     # Linter de código
```

## Documentación del Proyecto

- **[SUPABASE-SETUP.md](./SUPABASE-SETUP.md)** - Configuración de Supabase
- **[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)** - Guía completa de deploy
- **[FASE-5-COMPLETA.md](./FASE-5-COMPLETA.md)** - Panel de administración
- **[FASE-6-COMPLETA.md](./FASE-6-COMPLETA.md)** - Catálogo público
- **[FASE-7-COMPLETA.md](./FASE-7-COMPLETA.md)** - Funcionalidades adicionales
- **[FASE-8-COMPLETA.md](./FASE-8-COMPLETA.md)** - Optimizaciones y deploy

## Estado del Proyecto

✅ **PROYECTO COMPLETO Y LISTO PARA PRODUCCIÓN**

Todas las funcionalidades están implementadas, optimizadas y documentadas.
