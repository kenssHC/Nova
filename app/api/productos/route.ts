import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET: Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activo = searchParams.get("activo")
    const categoria_id = searchParams.get("categoria_id")

    let query = supabase
      .from("productos")
      .select(`
        *,
        categorias (
          id,
          nombre
        )
      `)
      .order("created_at", { ascending: false })

    // Filtrar por activo si se especifica
    if (activo !== null) {
      query = query.eq("activo", activo === "true")
    }

    // Filtrar por categoría si se especifica
    if (categoria_id) {
      query = query.eq("categoria_id", categoria_id)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error al obtener productos:", error)
      return NextResponse.json(
        { error: "Error al obtener productos" },
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

// POST: Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validaciones básicas
    if (!body.nombre || !body.precio_compra || !body.precio_venta) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: nombre, precio_compra, precio_venta" },
        { status: 400 }
      )
    }

    if (body.precio_compra < 0 || body.precio_venta < 0) {
      return NextResponse.json(
        { error: "Los precios no pueden ser negativos" },
        { status: 400 }
      )
    }

    if (body.stock && body.stock < 0) {
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

    const { data, error } = await supabase
      .from("productos")
      .insert([
        {
          nombre: body.nombre,
          descripcion: body.descripcion || null,
          precio_compra: body.precio_compra,
          precio_venta: body.precio_venta,
          descuento_porcentaje: body.descuento_porcentaje || 0,
          descuento_activo: body.descuento_activo || false,
          stock: body.stock || 0,
          imagen_url: body.imagen_url || null,
          categoria_id: body.categoria_id || null,
          activo: body.activo !== undefined ? body.activo : true,
        },
      ] as never)
      .select()
      .single()

    if (error) {
      console.error("Error al crear producto:", error)
      return NextResponse.json(
        { error: "Error al crear producto" },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
