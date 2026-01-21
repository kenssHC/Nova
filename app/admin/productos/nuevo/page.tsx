"use client"

import { useRouter } from "next/navigation"
import { createProducto } from "@/lib/api"
import { ProductForm } from "@/components/product-form"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Database } from "@/types/database"

type ProductoInsert = Database['public']['Tables']['productos']['Insert']

export default function NuevoProductoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: ProductoInsert) => {
    await createProducto(data)
    
    toast({
      title: "Producto creado",
      description: "El producto se creó exitosamente",
    })
    
    router.push("/admin/productos")
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
          <h1 className="text-3xl font-bold text-brand-wine">Nuevo Producto</h1>
          <p className="text-muted-foreground">Agrega un nuevo producto al catálogo</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm onSubmit={handleSubmit} submitLabel="Crear Producto" />
    </div>
  )
}
