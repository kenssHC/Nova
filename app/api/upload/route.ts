import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// POST: Subir imagen a Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF)" },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Tamaño máximo: 5MB" },
        { status: 400 }
      )
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileExt = file.name.split(".").pop()
    const fileName = `${timestamp}-${randomString}.${fileExt}`

    // Convertir File a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Supabase Storage
    const { error } = await supabase.storage
      .from("productos-images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      console.error("Error al subir imagen:", error)
      return NextResponse.json(
        { error: "Error al subir la imagen" },
        { status: 500 }
      )
    }

    // Obtener URL pública de la imagen
    const { data: publicUrlData } = supabase.storage
      .from("productos-images")
      .getPublicUrl(fileName)

    return NextResponse.json({
      message: "Imagen subida correctamente",
      fileName: fileName,
      url: publicUrlData.publicUrl,
    })
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar imagen de Supabase Storage
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get("fileName")

    if (!fileName) {
      return NextResponse.json(
        { error: "No se proporcionó el nombre del archivo" },
        { status: 400 }
      )
    }

    const { error } = await supabase.storage
      .from("productos-images")
      .remove([fileName])

    if (error) {
      console.error("Error al eliminar imagen:", error)
      return NextResponse.json(
        { error: "Error al eliminar la imagen" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Imagen eliminada correctamente",
    })
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
