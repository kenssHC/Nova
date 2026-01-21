"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCategorias, uploadImage, deleteImage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Loader2, Tag } from "lucide-react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import type { Categoria } from "@/types/database"

interface ProductFormData {
  nombre: string
  descripcion?: string | null
  precio_compra: number
  precio_venta: number
  descuento_porcentaje?: number
  descuento_activo?: boolean
  stock?: number
  imagen_url?: string | null
  categoria_id?: string | null
  activo?: boolean
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData & { id: string }>
  onSubmit: (data: ProductFormData) => Promise<void>
  submitLabel: string
}

export function ProductForm({ initialData, onSubmit, submitLabel }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || "",
    descripcion: initialData?.descripcion || "",
    precio_compra: initialData?.precio_compra || "",
    precio_venta: initialData?.precio_venta || "",
    descuento_porcentaje: initialData?.descuento_porcentaje || 0,
    descuento_activo: initialData?.descuento_activo || false,
    stock: initialData?.stock || "",
    categoria_id: initialData?.categoria_id || "",
    imagen_url: initialData?.imagen_url || "",
    activo: initialData?.activo !== undefined ? initialData.activo : true,
  })

  const [imagePreview, setImagePreview] = useState(initialData?.imagen_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch(console.error)
      .finally(() => setLoadingCategorias(false))
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Archivo inválido",
          description: "Por favor selecciona una imagen",
          variant: "destructive",
        })
        return
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "La imagen debe ser menor a 5MB",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    setFormData({ ...formData, imagen_url: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imagenUrl = formData.imagen_url

      // Subir nueva imagen si hay una
      if (imageFile) {
        setUploadingImage(true)
        const uploadResult = await uploadImage(imageFile)
        imagenUrl = uploadResult.url

        // Si hay una imagen anterior y se está reemplazando, eliminarla
        if (initialData?.imagen_url) {
          const oldFileName = initialData.imagen_url.split("/").pop()
          if (oldFileName) {
            await deleteImage(oldFileName).catch(console.error)
          }
        }
      }

      await onSubmit({
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        precio_compra: Number(formData.precio_compra),
        precio_venta: Number(formData.precio_venta),
        descuento_porcentaje: Number(formData.descuento_porcentaje),
        descuento_activo: formData.descuento_activo,
        stock: Number(formData.stock),
        categoria_id: formData.categoria_id || null,
        imagen_url: imagenUrl || null,
        activo: formData.activo,
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  if (loadingCategorias) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Cargando formulario..." />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre del Producto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Precios e Inventario */}
        <Card>
          <CardHeader>
            <CardTitle>Precios e Inventario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="precio_compra">
                Precio de Compra <span className="text-red-500">*</span>
              </Label>
              <Input
                id="precio_compra"
                type="number"
                min="0"
                step="0.01"
                value={formData.precio_compra}
                onChange={(e) => setFormData({ ...formData, precio_compra: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio_venta">
                Precio de Venta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="precio_venta"
                type="number"
                min="0"
                step="0.01"
                value={formData.precio_venta}
                onChange={(e) => setFormData({ ...formData, precio_venta: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">
                Stock Inicial <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            {formData.precio_compra && formData.precio_venta && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Ganancia por unidad:</strong>{" "}
                  ${(Number(formData.precio_venta) - Number(formData.precio_compra)).toLocaleString("es-CO")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Descuentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-brand-wine" />
              Descuentos y Promociones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="descuento_activo"
                checked={formData.descuento_activo}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, descuento_activo: checked as boolean })
                }
                disabled={loading}
              />
              <Label
                htmlFor="descuento_activo"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Activar descuento para este producto
              </Label>
            </div>

            {formData.descuento_activo && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="descuento_porcentaje">
                    Porcentaje de Descuento (%)
                  </Label>
                  <Input
                    id="descuento_porcentaje"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.descuento_porcentaje}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descuento_porcentaje: Math.min(100, Math.max(0, Number(e.target.value))),
                      })
                    }
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ingresa un valor entre 0 y 100
                  </p>
                </div>

                {formData.precio_venta && formData.descuento_porcentaje > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-800">Precio original:</span>
                      <span className="text-sm font-medium text-red-800 line-through">
                        ${Number(formData.precio_venta).toLocaleString("es-CO")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-red-900">Precio con descuento:</span>
                      <span className="text-lg font-bold text-red-900">
                        $
                        {(
                          Number(formData.precio_venta) *
                          (1 - Number(formData.descuento_porcentaje) / 100)
                        ).toLocaleString("es-CO")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-red-300">
                      <span className="text-xs text-red-700">Ganancia con descuento:</span>
                      <span
                        className={`text-xs font-semibold ${
                          Number(formData.precio_venta) *
                            (1 - Number(formData.descuento_porcentaje) / 100) <
                          Number(formData.precio_compra)
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        $
                        {(
                          Number(formData.precio_venta) *
                            (1 - Number(formData.descuento_porcentaje) / 100) -
                          Number(formData.precio_compra)
                        ).toLocaleString("es-CO")}
                      </span>
                    </div>
                    {Number(formData.precio_venta) *
                      (1 - Number(formData.descuento_porcentaje) / 100) <
                      Number(formData.precio_compra) && (
                      <p className="text-xs text-red-600 font-semibold">
                        ⚠️ Advertencia: Estás vendiendo a pérdida
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Imagen */}
      <Card>
        <CardHeader>
          <CardTitle>Imagen del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <Label
                  htmlFor="image"
                  className="cursor-pointer text-sm text-muted-foreground"
                >
                  Haz clic para subir una imagen
                  <br />
                  <span className="text-xs">PNG, JPG, GIF hasta 5MB</span>
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-brand-wine hover:bg-brand-wine/90"
          disabled={loading || uploadingImage}
        >
          {loading || uploadingImage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadingImage ? "Subiendo imagen..." : "Guardando..."}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
