// Funciones helper para interactuar con las API Routes

// ============================================
// PRODUCTOS
// ============================================

export async function getProductos(filters?: {
  activo?: boolean
  categoria_id?: string
}) {
  const params = new URLSearchParams()
  if (filters?.activo !== undefined) params.append("activo", String(filters.activo))
  if (filters?.categoria_id) params.append("categoria_id", filters.categoria_id)

  const url = `/api/productos${params.toString() ? `?${params.toString()}` : ""}`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Error al obtener productos")
  return res.json()
}

export async function getProducto(id: string) {
  const res = await fetch(`/api/productos/${id}`)
  if (!res.ok) throw new Error("Error al obtener producto")
  return res.json()
}

export async function createProducto(producto: {
  nombre: string
  descripcion?: string
  precio_compra: number
  precio_venta: number
  stock?: number
  imagen_url?: string
  categoria_id?: string
  activo?: boolean
}) {
  const res = await fetch("/api/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al crear producto")
  }
  return res.json()
}

export async function updateProducto(
  id: string,
  producto: {
    nombre?: string
    descripcion?: string
    precio_compra?: number
    precio_venta?: number
    stock?: number
    imagen_url?: string
    categoria_id?: string
    activo?: boolean
  }
) {
  const res = await fetch(`/api/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al actualizar producto")
  }
  return res.json()
}

export async function deleteProducto(id: string) {
  const res = await fetch(`/api/productos/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al eliminar producto")
  }
  return res.json()
}

// ============================================
// CATEGORÍAS
// ============================================

export async function getCategorias() {
  const res = await fetch("/api/categorias")
  if (!res.ok) throw new Error("Error al obtener categorías")
  return res.json()
}

export async function createCategoria(nombre: string) {
  const res = await fetch("/api/categorias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al crear categoría")
  }
  return res.json()
}

// ============================================
// VENTAS
// ============================================

export async function getVentas(filters?: {
  producto_id?: string
  fecha_inicio?: string
  fecha_fin?: string
}) {
  const params = new URLSearchParams()
  if (filters?.producto_id) params.append("producto_id", filters.producto_id)
  if (filters?.fecha_inicio) params.append("fecha_inicio", filters.fecha_inicio)
  if (filters?.fecha_fin) params.append("fecha_fin", filters.fecha_fin)

  const url = `/api/ventas${params.toString() ? `?${params.toString()}` : ""}`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Error al obtener ventas")
  return res.json()
}

export async function createVenta(venta: {
  producto_id: string
  cantidad: number
  cliente_nombre?: string
}) {
  const res = await fetch("/api/ventas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venta),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al registrar venta")
  }
  return res.json()
}

export async function getVentasStats(periodo: "dia" | "semana" | "mes" | "año" = "mes") {
  const res = await fetch(`/api/ventas/stats?periodo=${periodo}`)
  if (!res.ok) throw new Error("Error al obtener estadísticas")
  return res.json()
}

// ============================================
// SUBIDA DE IMÁGENES
// ============================================

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al subir imagen")
  }

  return res.json()
}

export async function deleteImage(fileName: string) {
  const res = await fetch(`/api/upload?fileName=${fileName}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Error al eliminar imagen")
  }

  return res.json()
}
