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
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src="/Logo.png"
                  alt="Oasis de Fragancias Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-5xl md:text-6xl text-brand-wine font-brand tracking-wide">Oasis de Fragancias</h1>
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
      <footer className="bg-brand-wine text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna Izquierda - QR */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src="/QR.png"
                  alt="QR Oasis de Fragancias"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <p className="text-sm text-brand-cream text-center md:text-left">
                Escanea para más productos
              </p>
            </div>

            {/* Columna Centro - Sobre Nosotros */}
            <div className="text-center">
              <h3 className="text-2xl mb-3 font-brand tracking-wide">Oasis de Fragancias</h3>
              <p className="text-brand-cream mb-4 leading-relaxed">
                Tu destino para perfumes y cuidado personal de calidad. 
                Ofrecemos los mejores productos a precios increíbles. 
                <span className="block mt-2 font-semibold text-brand-gold">
                  ¡Belleza y elegancia al alcance de todos!
                </span>
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-brand-gold">
                <Package className="h-4 w-4" />
                <span>Productos Originales</span>
              </div>
            </div>

            {/* Columna Derecha - Contacto */}
            <div className="text-center md:text-right">
              <h4 className="text-xl font-semibold mb-4 text-brand-gold">Contáctanos</h4>
              <div className="space-y-3">
                <a 
                  href="https://wa.me/51939919245" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-end gap-2 text-brand-cream hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  939 919 245
                </a>
                <a 
                  href="https://wa.me/51948898901" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-end gap-2 text-brand-cream hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  948 898 901
                </a>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-brand-pink/30 my-8"></div>

          {/* Banner Promocional */}
          <div className="text-center mb-6">
            <div className="inline-block bg-brand-gold/20 rounded-lg px-6 py-3 border border-brand-gold">
              <p className="text-brand-cream">
                ¿Quieres tu propia tienda virtual?{" "}
                <a 
                  href="https://portafolio-ten-lime-34.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-gold font-semibold hover:underline"
                >
                  haz click aquí y contáctame
                </a>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-brand-cream">
            <p>© 2026 KAIZEN SOLUTIONS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
