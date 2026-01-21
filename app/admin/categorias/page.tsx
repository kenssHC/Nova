"use client"

import { useEffect, useState } from "react"
import { getCategorias, createCategoria } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { Plus, Tag, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import type { Categoria } from "@/types/database"

export default function CategoriasPage() {
  const { toast } = useToast()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [nombreCategoria, setNombreCategoria] = useState("")

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      const data = await getCategorias()
      setCategorias(data)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createCategoria(nombreCategoria.trim())
      
      toast({
        title: "Categoría creada",
        description: "La categoría se creó exitosamente",
      })

      setNombreCategoria("")
      setDialogOpen(false)
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo crear la categoría"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando categorías..." />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-wine">Categorías</h1>
          <p className="text-muted-foreground">Gestiona las categorías de productos</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-wine hover:bg-brand-wine/90">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Crear Nueva Categoría</DialogTitle>
                <DialogDescription>
                  Agrega una nueva categoría para organizar tus productos
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">
                    Nombre de la Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    value={nombreCategoria}
                    onChange={(e) => setNombreCategoria(e.target.value)}
                    placeholder="Ej: Perfumes, Cremas, Shampoos..."
                    required
                    disabled={submitting}
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-wine hover:bg-brand-wine/90"
                  disabled={submitting || !nombreCategoria.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Categoría"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-white rounded-lg border">
          <p className="text-sm text-muted-foreground">Total Categorías</p>
          <p className="text-2xl font-bold">{categorias.length}</p>
        </div>
      </div>

      {/* Table */}
      {categorias.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No hay categorías"
          description="Comienza creando tu primera categoría para organizar los productos"
          action={
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-brand-wine hover:bg-brand-wine/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Categoría
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-brand-wine" />
                      {categoria.nombre}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(categoria.created_at)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {categoria.id}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Información */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Información</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Las categorías se usan para organizar los productos en el catálogo</li>
          <li>• Los clientes pueden filtrar productos por categoría</li>
          <li>• Asigna categorías al crear o editar productos</li>
          <li>• Las categorías no se pueden eliminar para mantener integridad de datos</li>
        </ul>
      </div>
    </div>
  )
}
