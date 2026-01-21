"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-gold flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-wine to-brand-pink flex items-center justify-center shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* 404 */}
        <div>
          <h1 className="text-8xl font-bold text-brand-wine mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-brand-brown mb-2">
            Página no encontrada
          </h2>
          <p className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="bg-brand-wine hover:bg-brand-wine/90 w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Ir al Inicio
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver Atrás
          </Button>
        </div>

        {/* Sugerencias */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Tal vez te interese:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/">
              <Button variant="link" size="sm" className="text-brand-wine">
                Ver Catálogo
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="link" size="sm" className="text-brand-wine">
                Panel Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
