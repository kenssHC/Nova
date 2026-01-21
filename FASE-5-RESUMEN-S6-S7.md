# Resumen de la Fase 5 - Sesiones 6 y 7

## SESIÓN 6: Sistema de Autenticación

### Archivos Creados

#### 1. `middleware.ts` - Protección de Rutas

Middleware de Next.js que protege todas las rutas `/admin/*`:

**Características:**
- Verifica token de autenticación en cookies
- Permite acceso libre a `/admin/login`
- Redirige a login si no está autenticado
- Preserva la URL de destino para redirección post-login

**Funcionamiento:**
```typescript
// Si intentas acceder a /admin/productos sin estar logueado
// Te redirige a: /admin/login?redirect=/admin/productos
```

---

#### 2. `lib/auth.ts` - Funciones de Autenticación

Helper functions para Supabase Auth:

```typescript
signIn(email, password)     // Iniciar sesión
signOut()                   // Cerrar sesión
getSession()                // Obtener sesión actual
getUser()                   // Obtener usuario actual
```

---

#### 3. `app/admin/login/page.tsx` - Página de Login

**Características:**
- Formulario de email y contraseña
- Validación de campos
- Manejo de errores
- Loading states
- Diseño con colores de marca Nova
- Guarda token en cookie al login exitoso
- Redirige automáticamente después del login

**Campos:**
- Email (requerido)
- Contraseña (requerido)

**Estados:**
- Normal
- Loading (enviando)
- Error (muestra mensaje)

---

#### 4. `app/admin/layout.tsx` - Layout del Admin Panel

Sidebar navigation con:

**Elementos:**
- Logo de Nova
- Links de navegación:
  - Dashboard
  - Productos
  - Ventas
  - Ver Catálogo (público)
- Botón de cerrar sesión
- Botón para colapsar/expandir sidebar

**Estados:**
- Expandido (w-64)
- Colapsado (w-20, solo íconos)

**Responsive:**
- Fixed sidebar
- Main content se ajusta automáticamente

---

#### 5. `app/admin/page.tsx` - Dashboard Principal

**Secciones:**

**Stats Cards (4 cards):**
1. Ganancias del Mes
   - Total de ganancias
   - Promedio por venta

2. Total Ventas
   - Número de transacciones

3. Productos Top
   - Cantidad de productos más vendidos

4. Stock Bajo
   - Productos con menos de 5 unidades

**Productos Más Vendidos:**
- Top 5 productos
- Cantidad vendida
- Ganancia total
- Número de ventas

**Alertas de Stock Bajo:**
- Lista de productos con stock < 5
- Badge con cantidad restante
- Diseño destacado con color naranja

---

## SESIÓN 7: CRUD de Productos

### Archivos Creados

#### 1. `app/admin/productos/page.tsx` - Listado de Productos

**Características:**

**Header:**
- Título y descripción
- Botón "Agregar Producto"

**Filtros:**
- Búsqueda por nombre (input con ícono)
- Filtro por categoría (select dropdown)
- Filtros en tiempo real

**Tabla de Productos:**
Columnas:
- Imagen (thumbnail 48x48px)
- Nombre
- Categoría
- Precio de venta
- Ganancia unitaria (verde)
- Stock con badges:
  - Rojo: Agotado (0)
  - Naranja: Bajo (< 5)
  - Gris: Normal
- Estado (Activo/Inactivo)
- Acciones:
  - Editar (ícono lápiz)
  - Eliminar (ícono basurero rojo)

**Estado Vacío:**
- Muestra `EmptyState` cuando no hay productos
- Diferentes mensajes según filtros activos
- Botón para agregar primer producto

**Dialog de Confirmación:**
- Se abre al hacer clic en eliminar
- Muestra nombre del producto
- Botones: Cancelar / Eliminar
- Loading state durante eliminación

---

#### 2. `components/product-form.tsx` - Formulario Reutilizable

Formulario usado tanto para crear como editar productos.

**Secciones:**

**1. Información Básica (Card):**
- Nombre (requerido)
- Descripción (textarea, opcional)
- Categoría (select con opciones de Supabase)

**2. Precios e Inventario (Card):**
- Precio de Compra (requerido, number, min: 0)
- Precio de Venta (requerido, number, min: 0)
- Stock Inicial (requerido, number, min: 0)
- Cálculo automático de ganancia (verde)

**3. Imagen (Card):**
- Upload de imagen
- Preview en tiempo real
- Validaciones:
  - Solo imágenes (JPEG, PNG, GIF, WebP)
  - Máximo 5MB
- Botón para remover imagen
- Drag & drop zone cuando no hay imagen

**Props:**
```typescript
interface ProductFormProps {
  initialData?: any        // Para modo edición
  onSubmit: (data: any) => Promise<void>
  submitLabel: string      // "Crear" o "Guardar Cambios"
}
```

**Características:**
- Carga categorías automáticamente
- Sube imagen a Supabase Storage
- Elimina imagen anterior al reemplazar
- Loading states en todos los botones
- Validación de formulario HTML5
- Toast notifications de errores

---

#### 3. `app/admin/productos/nuevo/page.tsx` - Crear Producto

**Características:**
- Header con botón "Volver"
- Título: "Nuevo Producto"
- Usa `ProductForm` con submitLabel="Crear Producto"
- Al guardar:
  - Toast de éxito
  - Redirige a `/admin/productos`

---

#### 4. `app/admin/productos/[id]/editar/page.tsx` - Editar Producto

**Características:**
- Header con botón "Volver"
- Título: "Editar Producto"
- Carga datos del producto por ID
- Loading state mientras carga
- Usa `ProductForm` con datos iniciales
- submitLabel="Guardar Cambios"
- Al guardar:
  - Toast de éxito
  - Redirige a `/admin/productos`

**Manejo de Errores:**
- Si no encuentra el producto, redirige a lista
- Muestra toast de error

---

## Componentes UI Adicionales Usados

De shadcn/ui (ya instalados en Fase 3):
- Alert Dialog (confirmación de eliminar)
- Select (filtros y categorías)
- Table (listado de productos)

---

## Flujo Completo de Autenticación

1. Usuario intenta acceder a `/admin`
2. Middleware verifica cookie `sb-access-token`
3. Si no existe, redirige a `/admin/login?redirect=/admin`
4. Usuario ingresa credenciales
5. `signIn()` autentica con Supabase
6. Guarda token en cookie
7. Redirige a URL original (`/admin`)
8. Middleware permite acceso

---

## Flujo Completo de CRUD

### Crear Producto:
1. Click en "Agregar Producto"
2. Rellena formulario
3. Sube imagen (opcional)
4. Click "Crear Producto"
5. Se sube imagen a Storage
6. Se crea producto en DB
7. Toast de éxito
8. Redirige a lista

### Editar Producto:
1. Click en ícono lápiz
2. Carga datos del producto
3. Modifica campos deseados
4. Cambia imagen (opcional)
5. Click "Guardar Cambios"
6. Si hay nueva imagen, se sube y elimina anterior
7. Se actualiza producto en DB
8. Toast de éxito
9. Redirige a lista

### Eliminar Producto:
1. Click en ícono basurero
2. Se abre dialog de confirmación
3. Click "Eliminar"
4. Se marca producto como inactivo (soft delete)
5. Toast de éxito
6. Se recarga lista

---

## Variables de Entorno Requeridas

Ya configuradas en `.env.local` desde Fase 2:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Credenciales de Admin

Para poder iniciar sesión, debes haber creado un usuario en Supabase:

1. Ve a tu proyecto en Supabase
2. Authentication > Users
3. Add User
4. Email: tu@email.com
5. Password: tu contraseña
6. Auto Confirm User: ✓

Estas credenciales se usan en `/admin/login`.

---

## Testing de las Funcionalidades

### Test de Autenticación:
1. Abre `http://localhost:3000/admin`
2. Debe redirigir a `/admin/login`
3. Ingresa credenciales de Supabase
4. Debe redirigir al dashboard

### Test de Dashboard:
1. Verifica que las cards muestren datos (pueden estar en 0)
2. Si hay ventas, verifica productos top
3. Si hay productos con stock bajo, verifica alertas

### Test de Productos:
1. Click "Agregar Producto"
2. Completa formulario con datos de prueba
3. Sube una imagen
4. Guarda y verifica que aparezca en la tabla
5. Click en editar
6. Modifica algún campo
7. Guarda y verifica cambios
8. Click en eliminar
9. Confirma y verifica que se marca como inactivo

---

## Archivos Creados en Esta Fase

```
middleware.ts                                 # Protección de rutas

lib/
└── auth.ts                                   # Funciones de auth

app/admin/
├── login/
│   └── page.tsx                             # Página de login
├── layout.tsx                                # Layout con sidebar
├── page.tsx                                  # Dashboard
└── productos/
    ├── page.tsx                              # Listado
    ├── nuevo/
    │   └── page.tsx                          # Crear
    └── [id]/
        └── editar/
            └── page.tsx                      # Editar

components/
└── product-form.tsx                          # Formulario reutilizable
```

Total: **10 archivos nuevos**

---

## Próximos Pasos

Las **Sesiones 8 y 9** incluirán:

1. **Gestión de Ventas:**
   - Listado de ventas
   - Registrar nueva venta
   - Filtros por fecha y producto
   
2. **Vista de Inventario:**
   - Vista consolidada del inventario
   - Edición rápida de stock
   - Alertas de reposición

---

## Capturas de Pantalla Esperadas

Si accedes a `http://localhost:3000/admin`:

**Login:**
- Formulario centrado con logo de Nova
- Campos de email y contraseña
- Botón "Iniciar Sesión"

**Dashboard:**
- Sidebar izquierdo con menú
- 4 cards de estadísticas en la parte superior
- Sección de productos más vendidos
- Alertas de stock bajo (si hay)

**Productos:**
- Tabla con todos los productos
- Filtros arriba
- Botón "Agregar Producto" en header

**Crear/Editar Producto:**
- Formulario en 2 columnas (desktop)
- Sección de upload de imagen
- Botones cancelar y guardar abajo
