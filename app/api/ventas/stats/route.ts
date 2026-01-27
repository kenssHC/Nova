import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Venta } from "@/types/database"

interface ProductoVendido {
  producto_id: string
  cantidad_total: number
  ganancia_total: number
  num_ventas: number
  nombre?: string
  imagen_url?: string | null
  categoria?: string | null
}

interface VentaPorDia {
  fecha: string
  total_ventas: number
  total_ganancias: number
}

// GET: Obtener estadísticas de ventas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const periodo = searchParams.get("periodo") || "mes" // dia, semana, mes, año

    // Calcular fecha de inicio según el período
    const ahora = new Date()
    const fechaInicio = new Date()

    switch (periodo) {
      case "dia":
        fechaInicio.setHours(0, 0, 0, 0)
        break
      case "semana":
        fechaInicio.setDate(ahora.getDate() - 7)
        break
      case "mes":
        fechaInicio.setMonth(ahora.getMonth() - 1)
        break
      case "año":
        fechaInicio.setFullYear(ahora.getFullYear() - 1)
        break
    }

    // Obtener ventas del período
    const { data: ventas, error: ventasError } = await supabase
      .from("ventas")
      .select("*")
      .gte("fecha_venta", fechaInicio.toISOString()) as { data: Venta[] | null; error: unknown }

    if (ventasError) {
      console.error("Error al obtener ventas:", ventasError)
      return NextResponse.json(
        { error: "Error al obtener estadísticas" },
        { status: 500 }
      )
    }

    // Calcular estadísticas
    const totalVentas = ventas?.length || 0
    const totalGanancias = ventas?.reduce((sum, venta) => sum + Number(venta.ganancia), 0) || 0
    const promedioGanancia = totalVentas > 0 ? totalGanancias / totalVentas : 0

    // Productos más vendidos
    const productosMasVendidos = ventas?.reduce((acc: Record<string, ProductoVendido>, venta) => {
      const productoId = venta.producto_id
      if (!acc[productoId]) {
        acc[productoId] = {
          producto_id: productoId,
          cantidad_total: 0,
          ganancia_total: 0,
          num_ventas: 0,
        }
      }
      acc[productoId].cantidad_total += venta.cantidad
      acc[productoId].ganancia_total += Number(venta.ganancia)
      acc[productoId].num_ventas += 1
      return acc
    }, {} as Record<string, ProductoVendido>)

    const topProductos = Object.values(productosMasVendidos || {})
      .sort((a, b) => b.cantidad_total - a.cantidad_total)
      .slice(0, 10)

    // Obtener información de productos con sus categorías
    if (topProductos.length > 0) {
      const productosIds = topProductos.map((p) => p.producto_id)
      const { data: productosInfo } = await supabase
        .from("productos")
        .select(`
          id,
          nombre,
          imagen_url,
          categorias (
            nombre
          )
        `)
        .in("id", productosIds) as { 
          data: { 
            id: string; 
            nombre: string; 
            imagen_url: string | null;
            categorias: { nombre: string } | null;
          }[] | null 
        }

      topProductos.forEach((producto) => {
        const info = productosInfo?.find((p) => p.id === producto.producto_id)
        if (info) {
          producto.nombre = info.nombre
          producto.imagen_url = info.imagen_url
          producto.categoria = info.categorias?.nombre || null
        }
      })
    }

    // Ventas por día (últimos 30 días)
    const ventasPorDia = ventas?.reduce((acc: Record<string, VentaPorDia>, venta) => {
      const fecha = new Date(venta.fecha_venta).toISOString().split("T")[0]
      if (!acc[fecha]) {
        acc[fecha] = {
          fecha,
          total_ventas: 0,
          total_ganancias: 0,
        }
      }
      acc[fecha].total_ventas += 1
      acc[fecha].total_ganancias += Number(venta.ganancia)
      return acc
    }, {} as Record<string, VentaPorDia>)

    const ventasPorDiaArray = Object.values(ventasPorDia || {}).sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )

    // Productos con stock bajo
    const { data: productosStockBajo } = await supabase
      .from("productos")
      .select("id, nombre, stock, imagen_url")
      .lt("stock", 5)
      .eq("activo", true)
      .order("stock", { ascending: true })

    return NextResponse.json({
      periodo,
      fecha_inicio: fechaInicio.toISOString(),
      fecha_fin: ahora.toISOString(),
      resumen: {
        total_ventas: totalVentas,
        total_ganancias: totalGanancias,
        promedio_ganancia: promedioGanancia,
      },
      top_productos: topProductos,
      ventas_por_dia: ventasPorDiaArray,
      productos_stock_bajo: productosStockBajo || [],
    })
  } catch (error) {
    console.error("Error inesperado:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
