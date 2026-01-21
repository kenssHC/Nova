"use client"

import { useEffect, useState } from "react"
import { getProductos, updateProducto } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Package, Pencil, Check, X, AlertTriangle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import type { ProductoConCategoria } from "@/types/database"

export default function InventarioPage() {
  const { toast } = useToast()

  const [productos, setProductos] = useState<ProductoConCategoria[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStock, setEditStock] = useState("")

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      const productosData = await getProductos({ activo: true })
      setProductos(productosData)
    } catch (error) {
      console.error("Error al cargar inventario:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el inventario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditStock = (producto: ProductoConCategoria) => {
    setEditingId(producto.id)
    setEditStock(producto.stock.toString())
  }

  const handleSaveStock = async (productoId: string) => {
    try {
      await updateProducto(productoId, {
        stock: Number(editStock),
      })

      toast({
        title: "Stock actualizado",
        description: "El stock se actualizó correctamente",
      })

      setEditingId(null)
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo actualizar el stock"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditStock("")
  }

  const totalProductos = productos.length
  const productosStockBajo = productos.filter((p) => p.stock < 5 && p.stock > 0).length
  const productosAgotados = productos.filter((p) => p.stock === 0).length
  const valorInventario = productos.reduce(
    (acc, p) => acc + p.precio_compra * p.stock,
    0
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando inventario..." />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-wine">Inventario</h1>
        <p className="text-muted-foreground">Control y gestión de stock de productos</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 bg-white rounded-lg border">
          <p className="text-sm text-muted-foreground">Total Productos</p>
          <p className="text-2xl font-bold">{totalProductos}</p>
        </div>
        <div className="p-4 bg-white rounded-lg border">
          <p className="text-sm text-muted-foreground">Valor Inventario</p>
          <p className="text-2xl font-bold text-blue-600">{formatPrice(valorInventario)}</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-orange-200">
          <p className="text-sm text-muted-foreground">Stock Bajo</p>
          <p className="text-2xl font-bold text-orange-600">{productosStockBajo}</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-red-200">
          <p className="text-sm text-muted-foreground">Agotados</p>
          <p className="text-2xl font-bold text-red-600">{productosAgotados}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio Compra</TableHead>
              <TableHead>Stock Actual</TableHead>
              <TableHead>Valor Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>
                  {producto.imagen_url ? (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                        src={producto.imagen_url}
                        alt={producto.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-brand-cream flex items-center justify-center">
                      <Package className="h-6 w-6 text-brand-brown" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{producto.nombre}</TableCell>
                <TableCell>{producto.categorias?.nombre || "-"}</TableCell>
                <TableCell>{formatPrice(producto.precio_compra)}</TableCell>
                <TableCell>
                  {editingId === producto.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-24"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600"
                        onClick={() => handleSaveStock(producto.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{producto.stock}</span>
                      <span className="text-muted-foreground text-sm">unidades</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatPrice(producto.precio_compra * producto.stock)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      producto.stock === 0
                        ? "destructive"
                        : producto.stock < 5
                        ? "outline"
                        : "secondary"
                    }
                    className={
                      producto.stock < 5 && producto.stock > 0
                        ? "border-orange-600 text-orange-600"
                        : ""
                    }
                  >
                    {producto.stock === 0 ? (
                      "Agotado"
                    ) : producto.stock < 5 ? (
                      <>
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Stock Bajo
                      </>
                    ) : (
                      "Normal"
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {editingId !== producto.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditStock(producto)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
