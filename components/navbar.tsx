"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, LayoutDashboard, ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function Navbar() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="/Logo.png"
              alt="Nova Logo"
              fill
              className="object-contain"
              priority
            />
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

          <Button variant="ghost" size="sm" asChild className="relative">
            <Link href="/carrito">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrito
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-brand-wine text-white text-xs"
                  variant="default"
                >
                  {totalItems}
                </Badge>
              )}
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
