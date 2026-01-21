"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProducto, updateProducto } from "@/lib/api"
import { ProductForm } from "@/components/product-form"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Producto, Database } from "@/types/database"

type ProductoUpdate = Database['public']['Tables']['productos']['Update']

export default function EditarProductoPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      getProducto(params.id as string)
        .then(setProducto)
        .catch(() => {
          toast({
            title: "Error",
            description: "No se pudo cargar el producto",
            variant: "destructive",
          })
          router.push("/admin/productos")
        })
        .finally(() => setLoading(false))
    }
  }, [params.id, router, toast])

  const handleSubmit = async (data: ProductoUpdate) => {
    await updateProducto(params.id as string, data)
    
    toast({
      title: "Producto actualizado",
      description: "Los cambios se guardaron exitosamente",
    })
    
    router.push("/admin/productos")
  }

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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/productos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-brand-wine">Editar Producto</h1>
          <p className="text-muted-foreground">Modifica la información del producto</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm
        initialData={producto}
        onSubmit={handleSubmit}
        submitLabel="Guardar Cambios"
      />
    </div>
  )
}
