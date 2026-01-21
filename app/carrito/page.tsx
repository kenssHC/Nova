"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/utils"
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  MessageCircle,
  Package,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { EmptyState } from "@/components/empty-state"

export default function CarritoPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } =
    useCart()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return

    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "976575550"

    let message = `*Hola! Me gustaria comprar los siguientes productos:*\n\n`

    items.forEach((item, index) => {
      const precioFinal =
        item.descuento_activo && item.descuento_porcentaje > 0
          ? item.precio_venta * (1 - item.descuento_porcentaje / 100)
          : item.precio_venta

      message += `${index + 1}. *${item.nombre}*\n`
      if (item.descuento_activo && item.descuento_porcentaje > 0) {
        message += `   - OFERTA: ${item.descuento_porcentaje}% OFF\n`
        message += `   - Precio: ${formatPrice(precioFinal)} (antes: ${formatPrice(item.precio_venta)})\n`
      } else {
        message += `   - Precio: ${formatPrice(precioFinal)}\n`
      }
      message += `   - Cantidad: ${item.cantidad}\n`
      message += `   - Subtotal: ${formatPrice(precioFinal * item.cantidad)}\n\n`
    })

    message += `---------------------------\n`
    message += `*Total de productos:* ${totalItems}\n`
    message += `*TOTAL A PAGAR:* ${formatPrice(totalPrice)}\n\n`
    message += `Estan disponibles estos productos?`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-gold py-12">
          <div className="container mx-auto px-4">
            <EmptyState
              icon={ShoppingCart}
              title="Tu carrito está vacío"
              description="Agrega productos desde el catálogo para empezar a comprar"
              action={
                <Link href="/">
                  <Button className="bg-brand-wine hover:bg-brand-wine/90">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Ver Catálogo
                  </Button>
                </Link>
              }
            />
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-gold py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-wine mb-2">
                Mi Carrito
              </h1>
              <p className="text-muted-foreground">
                {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu carrito
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Seguir Comprando
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de Productos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const precioFinal =
                  item.descuento_activo && item.descuento_porcentaje > 0
                    ? item.precio_venta * (1 - item.descuento_porcentaje / 100)
                    : item.precio_venta

                return (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Imagen */}
                        <Link href={`/productos/${item.id}`} className="flex-shrink-0">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-brand-cream to-brand-gold">
                            {item.imagen_url ? (
                              <Image
                                src={item.imagen_url}
                                alt={item.nombre}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-12 w-12 text-brand-brown/30" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Información */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/productos/${item.id}`}
                                className="hover:underline"
                              >
                                <h3 className="font-semibold text-brand-wine line-clamp-2">
                                  {item.nombre}
                                </h3>
                              </Link>
                              {item.descuento_activo && item.descuento_porcentaje > 0 && (
                                <Badge variant="destructive" className="mt-1">
                                  -{item.descuento_porcentaje}% OFF
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Precio */}
                          <div className="mb-3">
                            {item.descuento_activo && item.descuento_porcentaje > 0 ? (
                              <>
                                <p className="text-sm text-muted-foreground line-through">
                                  {formatPrice(item.precio_venta)}
                                </p>
                                <p className="text-xl font-bold text-green-600">
                                  {formatPrice(precioFinal)}
                                </p>
                              </>
                            ) : (
                              <p className="text-xl font-bold text-brand-brown">
                                {formatPrice(precioFinal)}
                              </p>
                            )}
                          </div>

                          {/* Cantidad y Subtotal */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                max={item.stock}
                                value={item.cantidad}
                                onChange={(e) =>
                                  updateQuantity(item.id, parseInt(e.target.value) || 1)
                                }
                                className="w-16 text-center h-8"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                disabled={item.cantidad >= item.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Subtotal</p>
                              <p className="text-lg font-bold text-brand-wine">
                                {formatPrice(precioFinal * item.cantidad)}
                              </p>
                            </div>
                          </div>

                          {/* Stock warning */}
                          {item.cantidad >= item.stock && (
                            <p className="text-xs text-orange-600 mt-2">
                              Stock máximo alcanzado ({item.stock} unidades disponibles)
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Botón Vaciar Carrito */}
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Vaciar Carrito
              </Button>
            </div>

            {/* Resumen del Pedido */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-brand-wine mb-4">
                    Resumen del Pedido
                  </h2>

                  {/* Detalles */}
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Productos</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    {items.some((item) => item.descuento_activo && item.descuento_porcentaje > 0) && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuentos aplicados</span>
                        <span className="font-semibold">
                          -
                          {formatPrice(
                            items.reduce((total, item) => {
                              if (item.descuento_activo && item.descuento_porcentaje > 0) {
                                const descuento =
                                  item.precio_venta *
                                  (item.descuento_porcentaje / 100) *
                                  item.cantidad
                                return total + descuento
                              }
                              return total
                            }, 0)
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="py-4 border-b">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-semibold text-brand-wine">TOTAL</span>
                      <span className="text-3xl font-bold text-brand-wine">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Botón de WhatsApp */}
                  <Button
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Comprar por WhatsApp
                  </Button>

                  {/* Información */}
                  <div className="pt-4 space-y-2 text-xs text-muted-foreground">
                    <p>✓ Envío coordinado por WhatsApp</p>
                    <p>✓ Pago al recibir (contraentrega)</p>
                    <p>✓ Productos 100% originales</p>
                  </div>

                  {/* Continuar comprando */}
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Seguir Comprando
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
