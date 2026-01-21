"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProductos, deleteProducto, getCategorias } from "@/lib/api"
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
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

export default function ProductosPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [productos, setProductos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all")
  const [productoToDelete, setProductoToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productosData, categoriasData] = await Promise.all([
        getProductos(),
        getCategorias(),
      ])
      setProductos(productosData)
      setCategorias(categoriasData)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!productoToDelete) return

    setDeleting(true)
    try {
      await deleteProducto(productoToDelete.id)
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó correctamente",
      })
      loadData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el producto",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setProductoToDelete(null)
    }
  }

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategoria =
      categoriaFilter === "all" || producto.categoria_id === categoriaFilter
    return matchesSearch && matchesCategoria
  })

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-wine">Productos</h1>
          <p className="text-muted-foreground">Gestiona tu catálogo de productos</p>
        </div>
        <Button
          onClick={() => router.push("/admin/productos/nuevo")}
          className="bg-brand-wine hover:bg-brand-wine/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredProductos.length === 0 ? (
        <EmptyState
          icon={Package}
          title={searchTerm || categoriaFilter !== "all" ? "No se encontraron productos" : "No hay productos"}
          description={
            searchTerm || categoriaFilter !== "all"
              ? "Intenta cambiar los filtros de búsqueda"
              : "Comienza agregando tu primer producto"
          }
          action={
            !searchTerm && categoriaFilter === "all" && (
              <Button
                onClick={() => router.push("/admin/productos/nuevo")}
                className="bg-brand-wine hover:bg-brand-wine/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Primer Producto
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
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Ganancia</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductos.map((producto) => (
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
                  <TableCell>
                    {producto.categorias?.nombre || "Sin categoría"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {producto.descuento_activo && producto.descuento_porcentaje > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(producto.precio_venta)}
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatPrice(
                              producto.precio_venta *
                                (1 - producto.descuento_porcentaje / 100)
                            )}
                          </span>
                        </div>
                      ) : (
                        <span>{formatPrice(producto.precio_venta)}</span>
                      )}
                      {producto.descuento_activo && producto.descuento_porcentaje > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          -{producto.descuento_porcentaje}%
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {producto.descuento_activo && producto.descuento_porcentaje > 0
                      ? formatPrice(
                          producto.precio_venta *
                            (1 - producto.descuento_porcentaje / 100) -
                            producto.precio_compra
                        )
                      : formatPrice(producto.precio_venta - producto.precio_compra)}
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
                      {producto.stock} unidades
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={producto.activo ? "default" : "secondary"}>
                      {producto.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/productos/${producto.id}/editar`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setProductoToDelete(producto)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productoToDelete} onOpenChange={() => setProductoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto "{productoToDelete?.nombre}". 
              Esta operación no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
