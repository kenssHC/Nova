"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getProducto } from "@/lib/api"
import { Navbar } from "@/components/navbar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ArrowLeft, Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { ProductoConCategoria } from "@/types/database"

export default function ProductoDetalle() {
  const params = useParams()
  const router = useRouter()
  const [producto, setProducto] = useState<ProductoConCategoria | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      getProducto(params.id as string)
        .then(setProducto)
        .catch((error) => {
          console.error("Error al cargar producto:", error)
          router.push("/")
        })
        .finally(() => setLoading(false))
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando producto..." />
      </div>
    )
  }

  if (!producto) {
    return null
  }

  const isOutOfStock = producto.stock === 0
  const isLowStock = producto.stock > 0 && producto.stock < 5
  const tieneDescuento = producto.descuento_activo && producto.descuento_porcentaje > 0
  const precioFinal = tieneDescuento
    ? producto.precio_venta * (1 - producto.descuento_porcentaje / 100)
    : producto.precio_venta

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-gold">
        <div className="container mx-auto px-4 py-8">
          {/* Botón Volver */}
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al catálogo
            </Button>
          </Link>

          {/* Detalle del Producto */}
          <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
            {/* Imagen del Producto */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-brand-cream to-brand-gold">
                {producto.imagen_url ? (
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-32 w-32 text-brand-brown/30" />
                  </div>
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="destructive" className="text-2xl px-6 py-3">
                      Agotado
                    </Badge>
                  </div>
                )}
                
                {tieneDescuento && !isOutOfStock && (
                  <Badge className="absolute top-4 left-4 bg-red-600 text-white text-xl px-4 py-2 font-bold animate-pulse">
                    🔥 -{producto.descuento_porcentaje}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Información del Producto */}
            <div className="space-y-6">
              {/* Categoría */}
              {producto.categorias?.nombre && (
                <Badge className="bg-brand-wine text-white">
                  {producto.categorias.nombre}
                </Badge>
              )}

              {/* Nombre */}
              <h1 className="text-4xl font-bold text-brand-wine">
                {producto.nombre}
              </h1>

              {/* Precio */}
              <div className="border-t border-b border-brand-gold/30 py-4">
                {tieneDescuento ? (
                  <div className="space-y-2">
                    <p className="text-xl text-muted-foreground line-through">
                      {formatPrice(producto.precio_venta)}
                    </p>
                    <p className="text-5xl font-bold text-green-600">
                      {formatPrice(precioFinal)}
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      ¡Ahorra {formatPrice(producto.precio_venta - precioFinal)}!
                    </p>
                  </div>
                ) : (
                  <p className="text-4xl font-bold text-brand-brown">
                    {formatPrice(producto.precio_venta)}
                  </p>
                )}
              </div>

              {/* Información de Stock */}
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-semibold">
                      Producto agotado
                    </span>
                  </>
                ) : isLowStock ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-orange-600 font-semibold">
                      ¡Pocas unidades! Solo {producto.stock}{" "}
                      {producto.stock === 1 ? "disponible" : "disponibles"}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">
                      Disponible - {producto.stock}{" "}
                      {producto.stock === 1 ? "unidad" : "unidades"}
                    </span>
                  </>
                )}
              </div>

              {/* Descripción */}
              {producto.descripcion && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-brand-wine">
                    Descripción
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {producto.descripcion}
                  </p>
                </div>
              )}

              {/* Botón de WhatsApp */}
              <div className="pt-4">
                <WhatsAppButton
                  productName={producto.nombre}
                  productPrice={precioFinal}
                  originalPrice={tieneDescuento ? producto.precio_venta : undefined}
                  discount={tieneDescuento ? producto.descuento_porcentaje : undefined}
                  productImage={producto.imagen_url || undefined}
                  className="w-full py-6 text-lg"
                  variant={isOutOfStock ? "outline" : "default"}
                />
                {isOutOfStock && (
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Puedes consultar disponibilidad por WhatsApp
                  </p>
                )}
              </div>

              {/* Información Adicional */}
              <div className="border-t border-brand-gold/30 pt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  ✓ Productos 100% originales
                </p>
                <p className="text-sm text-muted-foreground">
                  ✓ Consulta por WhatsApp antes de comprar
                </p>
                <p className="text-sm text-muted-foreground">
                  ✓ Envíos coordinados según tu ubicación
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
