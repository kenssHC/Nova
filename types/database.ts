export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio_compra: number
          precio_venta: number
          descuento_porcentaje: number
          descuento_activo: boolean
          stock: number
          imagen_url: string | null
          categoria_id: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          precio_compra: number
          precio_venta: number
          descuento_porcentaje?: number
          descuento_activo?: boolean
          stock?: number
          imagen_url?: string | null
          categoria_id?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          precio_compra?: number
          precio_venta?: number
          descuento_porcentaje?: number
          descuento_activo?: boolean
          stock?: number
          imagen_url?: string | null
          categoria_id?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categorias: {
        Row: {
          id: string
          nombre: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          created_at?: string
        }
      }
      ventas: {
        Row: {
          id: string
          producto_id: string
          cantidad: number
          precio_venta: number
          precio_compra: number
          ganancia: number
          fecha_venta: string
          cliente_nombre: string | null
        }
        Insert: {
          id?: string
          producto_id: string
          cantidad: number
          precio_venta: number
          precio_compra: number
          ganancia: number
          fecha_venta?: string
          cliente_nombre?: string | null
        }
        Update: {
          id?: string
          producto_id?: string
          cantidad?: number
          precio_venta?: number
          precio_compra?: number
          ganancia?: number
          fecha_venta?: string
          cliente_nombre?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
