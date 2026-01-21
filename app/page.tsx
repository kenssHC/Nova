"use client"

import { useEffect, useState } from "react"
import { getProductos, getCategorias } from "@/lib/api"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Package } from "lucide-react"

export default function Home() {
  const [productos, setProductos] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      getProductos({ activo: true }),
      getCategorias(),
    ])
      .then(([productosData, categoriasData]) => {
        setProductos(productosData)
        setCategorias(categoriasData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = productos.filter((producto) => {
    // Solo mostrar productos con stock > 0
    if (producto.stock === 0) return false

    const matchesSearch = producto.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory =
      !selectedCategory || producto.categoria_id === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-gold">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-wine to-brand-pink flex items-center justify-center shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-brand-wine">Nova</h1>
            </div>
            <p className="text-xl text-brand-brown mb-2">
              Perfumería y Cuidado Personal
            </p>
            <p className="text-muted-foreground">
              Descubre nuestra colección de productos de alta calidad
            </p>
          </div>

          {/* Barra de Búsqueda */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg border-2 border-brand-gold/30 focus:border-brand-wine"
              />
            </div>
          </div>

          {/* Filtros por Categoría */}
          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={
                  selectedCategory === null
                    ? "bg-brand-wine hover:bg-brand-wine/90"
                    : "border-brand-wine/30 hover:border-brand-wine"
                }
              >
                Todas las Categorías
              </Button>
              {categorias.map((categoria) => (
                <Button
                  key={categoria.id}
                  variant={selectedCategory === categoria.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(categoria.id)}
                  className={
                    selectedCategory === categoria.id
                      ? "bg-brand-wine hover:bg-brand-wine/90"
                      : "border-brand-wine/30 hover:border-brand-wine"
                  }
                >
                  {categoria.nombre}
                </Button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Cargando productos..." />
            </div>
          )}

          {/* Grid de Productos */}
          {!loading && filteredProducts.length === 0 && (
            <EmptyState
              icon={Package}
              title={
                searchTerm || selectedCategory
                  ? "No se encontraron productos"
                  : "No hay productos disponibles"
              }
              description={
                searchTerm || selectedCategory
                  ? "Intenta cambiar los filtros de búsqueda"
                  : "Vuelve pronto para ver nuestros productos"
              }
            />
          )}

          {!loading && filteredProducts.length > 0 && (
            <>
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Mostrando {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "producto" : "productos"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    id={producto.id}
                    nombre={producto.nombre}
                    descripcion={producto.descripcion}
                    precio_venta={producto.precio_venta}
                    descuento_porcentaje={producto.descuento_porcentaje}
                    descuento_activo={producto.descuento_activo}
                    stock={producto.stock}
                    imagen_url={producto.imagen_url}
                    categoria={producto.categorias?.nombre}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-wine text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Nova</h3>
          <p className="text-brand-cream mb-4">
            Perfumería y Cuidado Personal
          </p>
          <p className="text-sm text-brand-gold">
            © 2024 Nova. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  )
}
