"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface WhatsAppButtonProps {
  productName: string
  productPrice: number
  originalPrice?: number
  discount?: number
  productImage?: string
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WhatsAppButton({
  productName,
  productPrice,
  originalPrice,
  discount,
  productImage,
  className = "",
  variant = "default",
  size = "default",
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "939919245"

    // Mensaje pre-llenado mejorado
    let message = `Hola! Me interesa:\n\n`
    message += `📦 ${productName}\n`
    
    if (originalPrice && discount) {
      message += `🏷️ OFERTA: ${discount}% OFF\n`
      message += `💵 Precio regular: ${formatPrice(originalPrice)}\n`
      message += `💰 Precio oferta: ${formatPrice(productPrice)}\n`
    } else {
      message += `💵 Precio: ${formatPrice(productPrice)}\n`
    }

    if (productImage) {
      message += `📱 Ver imagen: ${productImage}\n`
    }

    message += `\n¿Está disponible?`

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message)

    // Crear el link de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Abrir en nueva ventana
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={handleClick}
      className={`${className} ${
        variant === "default"
          ? "bg-green-600 hover:bg-green-700 text-white"
          : ""
      }`}
      variant={variant}
      size={size}
    >
      <MessageCircle className={size === "sm" ? "mr-1 h-3 w-3" : "mr-2 h-4 w-4"} />
      {size === "sm" ? "WhatsApp" : "Comprar por WhatsApp"}
    </Button>
  )
}
