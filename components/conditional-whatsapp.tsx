"use client"

import { usePathname } from "next/navigation"
import { FloatingWhatsApp } from "./floating-whatsapp"

export function ConditionalWhatsApp() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  if (isAdminRoute) {
    return null
  }

  return <FloatingWhatsApp />
}
