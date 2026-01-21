import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream via-white to-brand-gold flex items-center justify-center">
      <LoadingSpinner size="lg" text="Cargando..." />
    </div>
  )
}
