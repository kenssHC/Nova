"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface CartItem {
  id: string
  nombre: string
  precio_venta: number
  descuento_porcentaje: number
  descuento_activo: boolean
  imagen_url: string | null
  stock: number
  cantidad: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (producto: Omit<CartItem, "cantidad">, cantidad?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    setIsClient(true)
    const savedCart = localStorage.getItem("nova-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error al cargar carrito:", error)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("nova-cart", JSON.stringify(items))
    }
  }, [items, isClient])

  const addToCart = (producto: Omit<CartItem, "cantidad">, cantidad: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === producto.id)

      if (existingItem) {
        // Verificar stock
        const newCantidad = existingItem.cantidad + cantidad
        if (newCantidad > producto.stock) {
          toast({
            title: "Stock insuficiente",
            description: `Solo hay ${producto.stock} unidades disponibles`,
            variant: "destructive",
          })
          return prevItems
        }

        // Actualizar cantidad
        return prevItems.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: newCantidad }
            : item
        )
      } else {
        // Agregar nuevo producto
        if (cantidad > producto.stock) {
          toast({
            title: "Stock insuficiente",
            description: `Solo hay ${producto.stock} unidades disponibles`,
            variant: "destructive",
          })
          return prevItems
        }

        toast({
          title: "Producto agregado",
          description: `${producto.nombre} se agregó al carrito`,
        })

        return [...prevItems, { ...producto, cantidad }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    toast({
      title: "Producto eliminado",
      description: "El producto se eliminó del carrito",
    })
  }

  const updateQuantity = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(id)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (cantidad > item.stock) {
            toast({
              title: "Stock insuficiente",
              description: `Solo hay ${item.stock} unidades disponibles`,
              variant: "destructive",
            })
            return item
          }
          return { ...item, cantidad }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos fueron eliminados",
    })
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.cantidad, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const precioFinal =
        item.descuento_activo && item.descuento_porcentaje > 0
          ? item.precio_venta * (1 - item.descuento_porcentaje / 100)
          : item.precio_venta
      return total + precioFinal * item.cantidad
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de CartProvider")
  }
  return context
}
