"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getVentas, getProductos } from "@/lib/api"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { Plus, ShoppingCart, Calendar } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function VentasPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [ventas, setVentas] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [productoFilter, setProductoFilter] = useState<string>("all")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [ventasData, productosData] = await Promise.all([
        getVentas(),
        getProductos({ activo: true }),
      ])
      setVentas(ventasData)
      setProductos(productosData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las ventas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredVentas = ventas.filter((venta) => {
    const matchesProducto =
      productoFilter === "all" || venta.producto_id === productoFilter

    let matchesFecha = true
    if (fechaInicio || fechaFin) {
      const ventaDate = new Date(venta.fecha_venta)
      if (fechaInicio) {
        matchesFecha = matchesFecha && ventaDate >= new Date(fechaInicio)
      }
      if (fechaFin) {
        const fechaFinDate = new Date(fechaFin)
        fechaFinDate.setHours(23, 59, 59, 999)
        matchesFecha = matchesFecha && ventaDate <= fechaFinDate
      }
    }

    return matchesProducto && matchesFecha
  })

  const totalGanancias = filteredVentas.reduce((acc, venta) => acc + venta.ganancia, 0)
  const totalVentas = filteredVentas.reduce(
    (acc, venta) => acc + venta.precio_venta * venta.cantidad,
    0
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando ventas..." />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-wine">Ventas</h1>
          <p className="text-muted-foreground">Historial y registro de ventas</p>
        </div>
        <Button
          onClick={() => router.push("/admin/ventas/nueva")}
          className="bg-brand-wine hover:bg-brand-wine/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Registrar Venta
        </Button>
      </div>

      {/* Stats Summary */}
      {filteredVentas.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-white rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Ventas</p>
            <p className="text-2xl font-bold">{filteredVentas.length}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <p className="text-sm text-muted-foreground">Monto Total</p>
            <p className="text-2xl font-bold text-blue-600">{formatPrice(totalVentas)}</p>
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <p className="text-sm text-muted-foreground">Ganancias Totales</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(totalGanancias)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Select value={productoFilter} onValueChange={setProductoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los productos</SelectItem>
              {productos.map((prod) => (
                <SelectItem key={prod.id} value={prod.id}>
                  {prod.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            placeholder="Fecha inicio"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            placeholder="Fecha fin"
          />
        </div>
      </div>

      {/* Table */}
      {filteredVentas.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={
            productoFilter !== "all" || fechaInicio || fechaFin
              ? "No se encontraron ventas"
              : "No hay ventas registradas"
          }
          description={
            productoFilter !== "all" || fechaInicio || fechaFin
              ? "Intenta cambiar los filtros de búsqueda"
              : "Comienza registrando tu primera venta"
          }
          action={
            !fechaInicio && !fechaFin && productoFilter === "all" && (
              <Button
                onClick={() => router.push("/admin/ventas/nueva")}
                className="bg-brand-wine hover:bg-brand-wine/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar Primera Venta
              </Button>
            )
          }
        />
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio Unit.</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Ganancia</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVentas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell>
                    {venta.productos?.imagen_url ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={venta.productos.imagen_url}
                          alt={venta.productos.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-brand-cream flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-brand-brown" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {venta.productos?.nombre || "Producto eliminado"}
                  </TableCell>
                  <TableCell>
                    {venta.cliente_nombre || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{venta.cantidad} unidades</Badge>
                  </TableCell>
                  <TableCell>{formatPrice(venta.precio_venta)}</TableCell>
                  <TableCell className="font-semibold">
                    {formatPrice(venta.precio_venta * venta.cantidad)}
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatPrice(venta.ganancia)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(venta.fecha_venta)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
