import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET: Obtener todas las categorías
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .order("nombre", { ascending: true })

    if (error) {
      console.error("Error al obtener categorías:", error)
      return NextResponse.json(
        { error: "Error al obtener categorías" },
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

// POST: Crear una nueva categoría
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { nombre?: string }

    if (!body.nombre) {
      return NextResponse.json(
        { error: "El nombre de la categoría es requerido" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("categorias")
      .insert([{ nombre: body.nombre }] as never)
      .select()
      .single()

    if (error) {
      // Si es error de duplicado
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Ya existe una categoría con ese nombre" },
          { status: 409 }
        )
      }
      console.error("Error al crear categoría:", error)
      return NextResponse.json(
        { error: "Error al crear categoría" },
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
