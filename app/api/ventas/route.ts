import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET: Obtener todas las ventas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const producto_id = searchParams.get("producto_id")
    const fecha_inicio = searchParams.get("fecha_inicio")
    const fecha_fin = searchParams.get("fecha_fin")

    let query = supabase
      .from("ventas")
      .select(`
        *,
        productos (
          id,
          nombre,
          imagen_url
        )
      `)
      .order("fecha_venta", { ascending: false })

    // Filtrar por producto si se especifica
    if (producto_id) {
      query = query.eq("producto_id", producto_id)
    }

    // Filtrar por rango de fechas
    if (fecha_inicio) {
      query = query.gte("fecha_venta", fecha_inicio)
    }
    if (fecha_fin) {
      query = query.lte("fecha_venta", fecha_fin)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error al obtener ventas:", error)
      return NextResponse.json(
        { error: "Error al obtener ventas" },
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

// POST: Registrar una nueva venta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validaciones
    if (!body.producto_id || !body.cantidad) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: producto_id, cantidad" },
        { status: 400 }
      )
    }

    if (body.cantidad <= 0) {
      return NextResponse.json(
        { error: "La cantidad debe ser mayor a 0" },
        { status: 400 }
      )
    }

    // Obtener información del producto
    const { data: producto, error: productoError } = await supabase
      .from("productos")
      .select("precio_compra, precio_venta, stock, descuento_porcentaje, descuento_activo")
      .eq("id", body.producto_id)
      .single() as { data: { precio_compra: number; precio_venta: number; stock: number; descuento_porcentaje: number; descuento_activo: boolean } | null; error: unknown }

    if (productoError || !producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    // Verificar stock suficiente
    if (producto.stock < body.cantidad) {
      return NextResponse.json(
        { error: `Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${body.cantidad}` },
        { status: 400 }
      )
    }

    // Calcular precio final con descuento si está activo
    let precioFinal = producto.precio_venta
    if (producto.descuento_activo && producto.descuento_porcentaje > 0) {
      precioFinal = producto.precio_venta * (1 - producto.descuento_porcentaje / 100)
    }

    // Calcular ganancia basada en el precio final (con descuento aplicado)
    const ganancia = (precioFinal - producto.precio_compra) * body.cantidad

    // Registrar la venta
    const { data, error } = await supabase
      .from("ventas")
      .insert([
        {
          producto_id: body.producto_id,
          cantidad: body.cantidad,
          precio_venta: precioFinal,
          precio_compra: producto.precio_compra,
          ganancia: ganancia,
          cliente_nombre: body.cliente_nombre || null,
        },
      ] as never)
      .select(`
        *,
        productos (
          id,
          nombre,
          imagen_url
        )
      `)
      .single()

    if (error) {
      console.error("Error al registrar venta:", error)
      return NextResponse.json(
        { error: "Error al registrar venta" },
        { status: 500 }
      )
    }

    // El trigger de la base de datos automáticamente restará el stock
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
