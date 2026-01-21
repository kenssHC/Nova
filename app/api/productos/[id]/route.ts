import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET: Obtener un producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("productos")
      .select(`
        *,
        categorias (
          id,
          nombre
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        )
      }
      console.error("Error al obtener producto:", error)
      return NextResponse.json(
        { error: "Error al obtener producto" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PUT: Actualizar un producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Validaciones
    if (body.precio_compra !== undefined && body.precio_compra < 0) {
      return NextResponse.json(
        { error: "El precio de compra no puede ser negativo" },
        { status: 400 }
      )
    }

    if (body.precio_venta !== undefined && body.precio_venta < 0) {
      return NextResponse.json(
        { error: "El precio de venta no puede ser negativo" },
        { status: 400 }
      )
    }

    if (body.stock !== undefined && body.stock < 0) {
      return NextResponse.json(
        { error: "El stock no puede ser negativo" },
        { status: 400 }
      )
    }

    // Validar descuento
    if (
      body.descuento_porcentaje !== undefined &&
      (body.descuento_porcentaje < 0 || body.descuento_porcentaje > 100)
    ) {
      return NextResponse.json(
        { error: "El descuento debe estar entre 0 y 100%" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (body.nombre !== undefined) updateData.nombre = body.nombre
    if (body.descripcion !== undefined) updateData.descripcion = body.descripcion
    if (body.precio_compra !== undefined) updateData.precio_compra = body.precio_compra
    if (body.precio_venta !== undefined) updateData.precio_venta = body.precio_venta
    if (body.descuento_porcentaje !== undefined) updateData.descuento_porcentaje = body.descuento_porcentaje
    if (body.descuento_activo !== undefined) updateData.descuento_activo = body.descuento_activo
    if (body.stock !== undefined) updateData.stock = body.stock
    if (body.imagen_url !== undefined) updateData.imagen_url = body.imagen_url
    if (body.categoria_id !== undefined) updateData.categoria_id = body.categoria_id
    if (body.activo !== undefined) updateData.activo = body.activo

    const { data, error } = await supabase
      .from("productos")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        )
      }
      console.error("Error al actualizar producto:", error)
      return NextResponse.json(
        { error: "Error al actualizar producto" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar un producto (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete: marcar como inactivo en lugar de eliminar
    const { data, error } = await supabase
      .from("productos")
      .update({ activo: false })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        )
      }
      console.error("Error al eliminar producto:", error)
      return NextResponse.json(
        { error: "Error al eliminar producto" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Producto eliminado correctamente", data })
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
