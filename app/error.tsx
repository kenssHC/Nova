"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Package, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log del error para debugging
    console.error("Error capturado:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-gold flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-wine to-brand-pink flex items-center justify-center shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Error Message */}
        <div>
          <h1 className="text-4xl font-bold text-brand-wine mb-2">
            Algo salió mal
          </h1>
          <p className="text-muted-foreground mb-4">
            Lo sentimos, ocurrió un error inesperado. Por favor, intenta nuevamente.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left p-4 bg-red-50 border border-red-200 rounded-lg text-sm">
              <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                Detalles del error (solo en desarrollo)
              </summary>
              <pre className="text-red-600 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-brand-wine hover:bg-brand-wine/90 w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar de Nuevo
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Ir al Inicio
            </Button>
          </Link>
        </div>

        {/* Ayuda */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Si el problema persiste, por favor contacta a soporte.
          </p>
        </div>
      </div>
    </div>
  )
}
