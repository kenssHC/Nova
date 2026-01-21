"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Package, Flame } from "lucide-react"

interface Product {
  id: string
  nombre: string
  precio_venta: number
  descuento_porcentaje: number
  descuento_activo: boolean
  imagen_url: string | null
  stock: number
}

interface OffersCarouselProps {
  products: Product[]
}

export function OffersCarousel({ products }: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filtrar solo productos con descuento activo
  const productsWithDiscount = products.filter(
    (p) => p.descuento_activo && p.descuento_porcentaje > 0 && p.stock > 0
  )

  if (productsWithDiscount.length === 0) {
    return null
  }

  // Mostrar máximo 4 productos a la vez en desktop
  const itemsPerPage = 4
  const totalPages = Math.ceil(productsWithDiscount.length / itemsPerPage)
  const startIndex = currentIndex * itemsPerPage
  const visibleProducts = productsWithDiscount.slice(startIndex, startIndex + itemsPerPage)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1))
  }

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Flame className="h-6 w-6 text-red-600" />
        <h2 className="text-3xl font-bold text-brand-wine">OFERTAS ESPECIALES</h2>
        <Flame className="h-6 w-6 text-red-600" />
      </div>

      {/* Carrusel */}
      <div className="relative bg-gradient-to-r from-red-50 via-white to-red-50 rounded-2xl p-6 border-2 border-red-200">
        {/* Botones de navegación */}
        {totalPages > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-brand-wine hover:text-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-brand-wine hover:text-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8">
          {visibleProducts.map((producto) => {
            const precioFinal = producto.precio_venta * (1 - producto.descuento_porcentaje / 100)
            const ahorro = producto.precio_venta - precioFinal

            return (
              <Link
                key={producto.id}
                href={`/productos/${producto.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg border-2 border-red-200 hover:border-red-400 transition-all hover:shadow-xl overflow-hidden">
                  {/* Imagen */}
                  <div className="relative aspect-square bg-gradient-to-br from-brand-cream to-brand-gold overflow-hidden">
                    {producto.imagen_url ? (
                      <Image
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-16 w-16 text-brand-brown/30" />
                      </div>
                    )}
                    
                    {/* Badge de descuento grande */}
                    <div className="absolute top-0 left-0 bg-red-600 text-white px-3 py-2 rounded-br-lg shadow-lg">
                      <p className="text-2xl font-bold">-{producto.descuento_porcentaje}%</p>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-sm text-brand-wine line-clamp-2 min-h-[2.5rem]">
                      {producto.nombre}
                    </h3>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(producto.precio_venta)}
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {formatPrice(precioFinal)}
                      </p>
                      <p className="text-xs text-green-600 font-semibold">
                        ¡Ahorra {formatPrice(ahorro)}!
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Indicadores de página */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-brand-wine"
                    : "w-2 bg-brand-wine/30 hover:bg-brand-wine/50"
                }`}
                aria-label={`Ir a página ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador */}
        {productsWithDiscount.length > itemsPerPage && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, productsWithDiscount.length)} de{" "}
            {productsWithDiscount.length} ofertas
          </p>
        )}
      </div>
    </div>
  )
}
