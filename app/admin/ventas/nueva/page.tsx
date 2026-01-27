"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProductos, createVenta } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, AlertCircle, ChevronsUpDown, Check } from "lucide-react"
import Link from "next/link"
import { formatPrice, cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import type { ProductoConCategoria } from "@/types/database"

export default function NuevaVentaPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [productos, setProductos] = useState<ProductoConCategoria[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    producto_id: "",
    cantidad: "",
    cliente_nombre: "",
  })

  const selectedProduct = productos.find((p) => p.id === formData.producto_id)

  useEffect(() => {
    getProductos({ activo: true })
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createVenta({
        producto_id: formData.producto_id,
        cantidad: Number(formData.cantidad),
        cliente_nombre: formData.cliente_nombre || null,
      })

      toast({
        title: "Venta registrada",
        description: "La venta se registró exitosamente. El stock se actualizó automáticamente.",
      })

      router.push("/admin/ventas")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo registrar la venta"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Calcular precio final considerando descuento
  const precioFinal = selectedProduct
    ? selectedProduct.descuento_activo && selectedProduct.descuento_porcentaje > 0
      ? selectedProduct.precio_venta * (1 - selectedProduct.descuento_porcentaje / 100)
      : selectedProduct.precio_venta
    : 0

  const gananciaTotal = selectedProduct
    ? (precioFinal - selectedProduct.precio_compra) * Number(formData.cantidad || 0)
    : 0

  const totalVenta = selectedProduct
    ? precioFinal * Number(formData.cantidad || 0)
    : 0

  const stockInsuficiente =
    selectedProduct &&
    formData.cantidad &&
    Number(formData.cantidad) > selectedProduct.stock

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando productos..." />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/ventas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-brand-wine">Registrar Venta</h1>
          <p className="text-muted-foreground">Registra una nueva venta en el sistema</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Producto */}
            <div className="space-y-2">
              <Label htmlFor="producto">
                Producto <span className="text-red-500">*</span>
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={submitting}
                  >
                    {formData.producto_id
                      ? (() => {
                          const producto = productos.find((p) => p.id === formData.producto_id)
                          return producto
                            ? `${producto.nombre} - Stock: ${producto.stock} - ${formatPrice(producto.precio_venta)}`
                            : "Buscar producto..."
                        })()
                      : "Buscar producto..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[500px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar producto por nombre..." />
                    <CommandEmpty>No se encontró el producto.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {productos.map((producto) => (
                          <CommandItem
                            key={producto.id}
                            value={producto.nombre}
                            onSelect={() => {
                              setFormData({ ...formData, producto_id: producto.id })
                              setOpen(false)
                            }}
                            disabled={producto.stock === 0}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.producto_id === producto.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2 flex-1">
                              {producto.imagen_url && (
                                <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={producto.imagen_url}
                                    alt={producto.nombre}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{producto.nombre}</p>
                                <p className="text-sm text-muted-foreground">
                                  Stock: {producto.stock} • {formatPrice(producto.precio_venta)}
                                  {producto.descuento_activo && producto.descuento_porcentaje > 0 && (
                                    <span className="ml-1 text-red-600">
                                      (-{producto.descuento_porcentaje}%)
                                    </span>
                                  )}
                                </p>
                              </div>
                              {producto.stock === 0 && (
                                <span className="text-xs text-red-600 font-semibold">Sin stock</span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <Label htmlFor="cantidad">
                Cantidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                max={selectedProduct?.stock || 0}
                value={formData.cantidad}
                onChange={(e) =>
                  setFormData({ ...formData, cantidad: e.target.value })
                }
                required
                disabled={submitting || !formData.producto_id}
              />
              {selectedProduct && (
                <p className="text-sm text-muted-foreground">
                  Stock disponible: {selectedProduct.stock} unidades
                </p>
              )}
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente">Nombre del Cliente (Opcional)</Label>
              <Input
                id="cliente"
                value={formData.cliente_nombre}
                onChange={(e) =>
                  setFormData({ ...formData, cliente_nombre: e.target.value })
                }
                disabled={submitting}
                placeholder="Juan Pérez"
              />
            </div>

            {/* Alertas */}
            {stockInsuficiente && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Stock insuficiente. Solo hay {selectedProduct.stock} unidades disponibles.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Resumen */}
        {selectedProduct && formData.cantidad && !stockInsuficiente && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen de la Venta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Producto Seleccionado */}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  {selectedProduct.imagen_url && (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={selectedProduct.imagen_url}
                        alt={selectedProduct.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{selectedProduct.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(selectedProduct.precio_venta)} x {formData.cantidad}{" "}
                      unidades
                    </p>
                  </div>
                </div>

                {/* Cálculos */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio de Compra:</span>
                    <span>{formatPrice(selectedProduct.precio_compra)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio de Venta Original:</span>
                    <span>{formatPrice(selectedProduct.precio_venta)}</span>
                  </div>
                  
                  {/* Mostrar descuento si está activo */}
                  {selectedProduct.descuento_activo && selectedProduct.descuento_porcentaje > 0 && (
                    <>
                      <div className="flex justify-between text-red-600">
                        <span>Descuento Aplicado:</span>
                        <span className="font-semibold">-{selectedProduct.descuento_porcentaje}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Precio Final con Descuento:</span>
                        <span className="font-semibold text-green-600">{formatPrice(precioFinal)}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cantidad:</span>
                    <span>{formData.cantidad} unidades</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Venta:</span>
                      <span className="text-blue-600">{formatPrice(totalVenta)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-2">
                      <span>Ganancia:</span>
                      <span className="text-green-600">{formatPrice(gananciaTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-brand-wine hover:bg-brand-wine/90"
            disabled={submitting || stockInsuficiente || !formData.producto_id || !formData.cantidad}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrar Venta"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
