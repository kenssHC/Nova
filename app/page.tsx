"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getProductos, getCategorias } from "@/lib/api"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { OffersCarousel } from "@/components/offers-carousel"
import { LoadingSpinner } from "@/components/loading-spinner"
import { EmptyState } from "@/components/empty-state"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MoreHorizontal, Package } from "lucide-react"
import type { ProductoConCategoria, Categoria } from "@/types/database"

export default function Home() {
  const [productos, setProductos] = useState<ProductoConCategoria[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("newest")

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

  const filteredProducts = productos
    .filter((producto) => {
      // Solo mostrar productos con stock > 0
      if (producto.stock === 0) return false

      const matchesSearch = producto.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesCategory =
        !selectedCategory || producto.categoria_id === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          const precioA =
            a.descuento_activo && a.descuento_porcentaje > 0
              ? a.precio_venta * (1 - a.descuento_porcentaje / 100)
              : a.precio_venta
          const precioB =
            b.descuento_activo && b.descuento_porcentaje > 0
              ? b.precio_venta * (1 - b.descuento_porcentaje / 100)
              : b.precio_venta
          return precioA - precioB
        case "price-desc":
          const precioCa =
            a.descuento_activo && a.descuento_porcentaje > 0
              ? a.precio_venta * (1 - a.descuento_porcentaje / 100)
              : a.precio_venta
          const precioCb =
            b.descuento_activo && b.descuento_porcentaje > 0
              ? b.precio_venta * (1 - b.descuento_porcentaje / 100)
              : b.precio_venta
          return precioCb - precioCa
        case "discount":
          const descA = a.descuento_activo ? a.descuento_porcentaje : 0
          const descB = b.descuento_activo ? b.descuento_porcentaje : 0
          return descB - descA
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-gold">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section Mejorado */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src="/Logo.png"
                  alt="Nova Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-brand-wine">Nova</h1>
            </div>
            <p className="text-xl text-brand-brown mb-2">
              Perfumería y Cuidado Personal
            </p>
            <p className="text-muted-foreground mb-6">
              Descubre nuestra colección de productos de alta calidad
            </p>

            {/* Trust Badges 
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
              <div className="flex items-center gap-2 text-sm text-brand-wine">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Productos Originales</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-wine">
                <Truck className="h-5 w-5" />
                <span className="font-medium">Envío Rápido</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-wine">
                <Zap className="h-5 w-5" />
                <span className="font-medium">Atención Inmediata</span>
              </div>
            </div>*/}
          </div>

          {/* Carrusel de Ofertas */}
          {!loading && <OffersCarousel products={productos} />}

          {/* Barra de Búsqueda Mejorada */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-lg border-2 border-brand-gold/30 focus:border-brand-wine"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[220px] py-6 border-2 border-brand-gold/30">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más Nuevos</SelectItem>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="discount">Mayor Descuento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros por Categoría - Sistema Híbrido */}
          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {/* Botón Todas */}
              <Button
                size="sm"
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={
                  selectedCategory === null
                    ? "bg-brand-wine hover:bg-brand-wine/90"
                    : "border-brand-wine/30 hover:border-brand-wine"
                }
              >
                Todas
              </Button>
              
              {/* Primeras 3 categorías como botones */}
              {categorias.slice(0, 3).map((categoria) => (
                <Button
                  key={categoria.id}
                  size="sm"
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
              
              {/* Dropdown "Más..." para el resto de categorías */}
              {categorias.length > 3 && (
                <Select
                  value={
                    selectedCategory &&
                    !categorias.slice(0, 3).find((c) => c.id === selectedCategory)
                      ? selectedCategory
                      : "more"
                  }
                  onValueChange={(value) => {
                    if (value !== "more") {
                      setSelectedCategory(value)
                    }
                  }}
                >
                  <SelectTrigger className="w-[140px] h-9 border-brand-wine/30 hover:border-brand-wine">
                    <MoreHorizontal className="h-4 w-4 mr-1" />
                    <SelectValue placeholder="Más..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.slice(3).map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
