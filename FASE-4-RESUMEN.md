# Resumen de la Fase 4 - API Routes - Backend

## API Routes Creadas

Se crearon 6 archivos de API Routes para manejar toda la lógica del backend:

---

## 1. API de Productos

### `app/api/productos/route.ts`

**GET `/api/productos`** - Obtener todos los productos

Query Parameters:
- `activo` (opcional): `true` o `false` para filtrar por estado
- `categoria_id` (opcional): UUID para filtrar por categoría

Respuesta:
```json
[
  {
    "id": "uuid",
    "nombre": "Perfume X",
    "descripcion": "Descripción",
    "precio_compra": 50000,
    "precio_venta": 85000,
    "stock": 12,
    "imagen_url": "https://...",
    "categoria_id": "uuid",
    "activo": true,
    "created_at": "2024-01-20T...",
    "updated_at": "2024-01-20T...",
    "categorias": {
      "id": "uuid",
      "nombre": "Perfumes"
    }
  }
]
```

**POST `/api/productos`** - Crear nuevo producto

Body:
```json
{
  "nombre": "Producto Nuevo",
  "descripcion": "Descripción opcional",
  "precio_compra": 30000,
  "precio_venta": 50000,
  "stock": 10,
  "imagen_url": "https://...",
  "categoria_id": "uuid",
  "activo": true
}
```

Validaciones:
- `nombre`, `precio_compra`, `precio_venta` son requeridos
- Los precios no pueden ser negativos
- El stock no puede ser negativo

---

### `app/api/productos/[id]/route.ts`

**GET `/api/productos/:id`** - Obtener un producto específico

**PUT `/api/productos/:id`** - Actualizar producto

Body (todos los campos son opcionales):
```json
{
  "nombre": "Nuevo nombre",
  "descripcion": "Nueva descripción",
  "precio_compra": 35000,
  "precio_venta": 55000,
  "stock": 15,
  "imagen_url": "https://...",
  "categoria_id": "uuid",
  "activo": true
}
```

**DELETE `/api/productos/:id`** - Eliminar producto (soft delete)

Nota: No elimina físicamente el producto, solo marca `activo: false`

---

## 2. API de Categorías

### `app/api/categorias/route.ts`

**GET `/api/categorias`** - Obtener todas las categorías

Respuesta:
```json
[
  {
    "id": "uuid",
    "nombre": "Perfumes",
    "created_at": "2024-01-20T..."
  }
]
```

**POST `/api/categorias`** - Crear nueva categoría

Body:
```json
{
  "nombre": "Nueva Categoría"
}
```

Validaciones:
- El nombre es requerido
- No pueden existir dos categorías con el mismo nombre

---

## 3. API de Ventas

### `app/api/ventas/route.ts`

**GET `/api/ventas`** - Obtener todas las ventas

Query Parameters:
- `producto_id` (opcional): UUID para filtrar por producto
- `fecha_inicio` (opcional): ISO Date para inicio del rango
- `fecha_fin` (opcional): ISO Date para fin del rango

Respuesta:
```json
[
  {
    "id": "uuid",
    "producto_id": "uuid",
    "cantidad": 2,
    "precio_venta": 85000,
    "precio_compra": 50000,
    "ganancia": 70000,
    "fecha_venta": "2024-01-20T...",
    "cliente_nombre": "Juan Pérez",
    "productos": {
      "id": "uuid",
      "nombre": "Perfume X",
      "imagen_url": "https://..."
    }
  }
]
```

**POST `/api/ventas`** - Registrar nueva venta

Body:
```json
{
  "producto_id": "uuid",
  "cantidad": 2,
  "cliente_nombre": "Juan Pérez" // opcional
}
```

Validaciones:
- `producto_id` y `cantidad` son requeridos
- La cantidad debe ser mayor a 0
- Verifica que haya stock suficiente antes de registrar
- Calcula automáticamente la ganancia
- El trigger de la base de datos resta automáticamente el stock

---

### `app/api/ventas/stats/route.ts`

**GET `/api/ventas/stats`** - Obtener estadísticas de ventas

Query Parameters:
- `periodo` (opcional): `dia`, `semana`, `mes` (default), `año`

Respuesta:
```json
{
  "periodo": "mes",
  "fecha_inicio": "2023-12-20T...",
  "fecha_fin": "2024-01-20T...",
  "resumen": {
    "total_ventas": 45,
    "total_ganancias": 1500000,
    "promedio_ganancia": 33333.33
  },
  "top_productos": [
    {
      "producto_id": "uuid",
      "nombre": "Perfume X",
      "cantidad_total": 25,
      "ganancia_total": 500000,
      "num_ventas": 15,
      "imagen_url": "https://..."
    }
  ],
  "ventas_por_dia": [
    {
      "fecha": "2024-01-15",
      "total_ventas": 5,
      "total_ganancias": 150000
    }
  ],
  "productos_stock_bajo": [
    {
      "id": "uuid",
      "nombre": "Producto X",
      "stock": 3,
      "imagen_url": "https://..."
    }
  ]
}
```

---

## 4. API de Subida de Imágenes

### `app/api/upload/route.ts`

**POST `/api/upload`** - Subir imagen a Supabase Storage

Content-Type: `multipart/form-data`

Body:
```
file: File (imagen)
```

Validaciones:
- Solo se permiten imágenes: JPEG, PNG, WebP, GIF
- Tamaño máximo: 5MB
- Genera nombre único automáticamente

Respuesta:
```json
{
  "message": "Imagen subida correctamente",
  "fileName": "1234567890-abc123.jpg",
  "url": "https://xxx.supabase.co/storage/v1/object/public/productos-images/1234567890-abc123.jpg"
}
```

**DELETE `/api/upload?fileName=xxx`** - Eliminar imagen

Query Parameters:
- `fileName`: Nombre del archivo a eliminar

---

## 5. Funciones Helper (`lib/api.ts`)

Se crearon funciones helper para facilitar el uso de las APIs desde el frontend:

### Productos
```typescript
getProductos(filters?: { activo?: boolean, categoria_id?: string })
getProducto(id: string)
createProducto(producto: {...})
updateProducto(id: string, producto: {...})
deleteProducto(id: string)
```

### Categorías
```typescript
getCategorias()
createCategoria(nombre: string)
```

### Ventas
```typescript
getVentas(filters?: { producto_id?: string, fecha_inicio?: string, fecha_fin?: string })
createVenta(venta: { producto_id: string, cantidad: number, cliente_nombre?: string })
getVentasStats(periodo: "dia" | "semana" | "mes" | "año")
```

### Imágenes
```typescript
uploadImage(file: File)
deleteImage(fileName: string)
```

---

## Ejemplo de Uso en Componentes

### Obtener productos
```tsx
"use client"

import { useEffect, useState } from "react"
import { getProductos } from "@/lib/api"

export function ProductosLista() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProductos({ activo: true })
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      {productos.map(producto => (
        <div key={producto.id}>{producto.nombre}</div>
      ))}
    </div>
  )
}
```

### Crear producto
```tsx
"use client"

import { useState } from "react"
import { createProducto, uploadImage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function CrearProducto() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true)

      // Subir imagen primero
      const file = formData.get("imagen") as File
      let imagenUrl = ""
      
      if (file) {
        const uploadResult = await uploadImage(file)
        imagenUrl = uploadResult.url
      }

      // Crear producto
      await createProducto({
        nombre: formData.get("nombre") as string,
        descripcion: formData.get("descripcion") as string,
        precio_compra: Number(formData.get("precio_compra")),
        precio_venta: Number(formData.get("precio_venta")),
        stock: Number(formData.get("stock")),
        imagen_url: imagenUrl,
        categoria_id: formData.get("categoria_id") as string,
      })

      toast({
        title: "Producto creado",
        description: "El producto se creó correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // ... resto del componente
}
```

### Registrar venta
```tsx
"use client"

import { createVenta } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function RegistrarVenta() {
  const { toast } = useToast()

  const handleVenta = async (productoId: string, cantidad: number) => {
    try {
      await createVenta({
        producto_id: productoId,
        cantidad: cantidad,
        cliente_nombre: "Cliente X",
      })

      toast({
        title: "Venta registrada",
        description: `Se vendieron ${cantidad} unidades. El stock se actualizó automáticamente.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // ... resto del componente
}
```

---

## Manejo de Errores

Todas las API Routes manejan errores y devuelven respuestas consistentes:

**Errores comunes:**

400 Bad Request:
```json
{ "error": "Descripción del error de validación" }
```

404 Not Found:
```json
{ "error": "Recurso no encontrado" }
```

409 Conflict:
```json
{ "error": "Ya existe un recurso con esos datos" }
```

500 Internal Server Error:
```json
{ "error": "Error interno del servidor" }
```

---

## Funcionalidades Automáticas

Gracias a los triggers de Supabase configurados en la Fase 2:

1. **Validación de Stock**: Al intentar crear una venta, se valida automáticamente que haya stock suficiente

2. **Resta Automática de Stock**: Al registrar una venta, el stock se resta automáticamente mediante un trigger

3. **Actualización de Timestamps**: El campo `updated_at` se actualiza automáticamente en productos

4. **Cálculo de Ganancias**: La API calcula automáticamente la ganancia en cada venta: `(precio_venta - precio_compra) * cantidad`

---

## Testing de las APIs

Puedes probar las APIs usando herramientas como:

- **Postman** o **Insomnia**
- **Thunder Client** (extensión de VSCode)
- **curl** desde la terminal

Ejemplo con curl:
```bash
# Obtener productos
curl http://localhost:3000/api/productos

# Crear producto
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","precio_compra":1000,"precio_venta":2000}'

# Obtener estadísticas
curl http://localhost:3000/api/ventas/stats?periodo=mes
```

---

## Próximos Pasos

La **Fase 5** incluirá:

1. Panel de administración con páginas para:
   - Dashboard con gráficos
   - CRUD de productos con formularios
   - Gestión de ventas
   - Vista de inventario
2. Autenticación de admin
3. Protección de rutas
4. Integración completa con las APIs creadas

---

## Archivos Creados en Esta Fase

```
app/api/
├── productos/
│   ├── route.ts              # GET, POST productos
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE producto
├── categorias/
│   └── route.ts              # GET, POST categorías
├── ventas/
│   ├── route.ts              # GET, POST ventas
│   └── stats/
│       └── route.ts          # GET estadísticas
└── upload/
    └── route.ts              # POST, DELETE imágenes

lib/
└── api.ts                    # Helper functions
```

Total: **7 archivos nuevos**
