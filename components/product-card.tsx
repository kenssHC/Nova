"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { formatPrice } from "@/lib/utils"
import { Package, Eye } from "lucide-react"

interface ProductCardProps {
  id: string
  nombre: string
  descripcion?: string | null
  precio_venta: number
  descuento_porcentaje?: number
  descuento_activo?: boolean
  stock: number
  imagen_url?: string | null
  categoria?: string
}

export function ProductCard({
  id,
  nombre,
  descripcion,
  precio_venta,
  descuento_porcentaje = 0,
  descuento_activo = false,
  stock,
  imagen_url,
  categoria,
}: ProductCardProps) {
  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock < 5
  const tieneDescuento = descuento_activo && descuento_porcentaje > 0
  const precioFinal = tieneDescuento
    ? precio_venta * (1 - descuento_porcentaje / 100)
    : precio_venta

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-square bg-gradient-to-br from-brand-cream to-brand-gold">
          {imagen_url ? (
            <Image
              src={imagen_url}
              alt={nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-20 w-20 text-brand-brown/30" />
            </div>
          )}
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Agotado
              </Badge>
            </div>
          )}
          
          {tieneDescuento && !isOutOfStock && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white font-bold animate-pulse">
              -{descuento_porcentaje}% OFF
            </Badge>
          )}
          
          {categoria && !isOutOfStock && (
            <Badge 
              className="absolute top-2 right-2 bg-brand-wine text-white"
              variant="secondary"
            >
              {categoria}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-brand-wine mb-2 line-clamp-2">
          {nombre}
        </h3>
        
        {descripcion && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {descripcion}
          </p>
        )}
        
        <div className="space-y-1">
          {tieneDescuento ? (
            <>
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(precio_venta)}
              </p>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(precioFinal)}
                </p>
                {isLowStock && !isOutOfStock && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    ¡Pocas unidades!
                  </Badge>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-brand-brown">
                {formatPrice(precio_venta)}
              </p>
              {isLowStock && !isOutOfStock && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  ¡Pocas unidades!
                </Badge>
              )}
            </div>
          )}
        </div>

        {!isOutOfStock && (
          <p className="text-sm text-muted-foreground mt-2">
            Stock disponible: {stock} {stock === 1 ? 'unidad' : 'unidades'}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Link href={`/productos/${id}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full border-brand-wine text-brand-wine hover:bg-brand-wine hover:text-white"
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalles
          </Button>
        </Link>
        <WhatsAppButton
          productName={nombre}
          productPrice={precioFinal}
          originalPrice={tieneDescuento ? precio_venta : undefined}
          discount={tieneDescuento ? descuento_porcentaje : undefined}
          productImage={imagen_url || undefined}
          className="w-full"
          variant={isOutOfStock ? "outline" : "default"}
        />
      </CardFooter>
    </Card>
  )
}
