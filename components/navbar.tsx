"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, LayoutDashboard } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-wine to-brand-pink">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-wine">Nova</h1>
            <p className="text-xs text-brand-brown">Perfumería</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Catálogo
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
