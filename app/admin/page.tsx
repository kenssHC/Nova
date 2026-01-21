"use client"

import { useEffect, useState } from "react"
import { getVentasStats, getVentas } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"

const COLORS = ["#96305a", "#ca678e", "#b08e6b", "#e8c39e", "#f5e1ce"]

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [ultimasVentas, setUltimasVentas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getVentasStats("mes"), getVentas()])
      .then(([statsData, ventasData]) => {
        setStats(statsData)
        setUltimasVentas(ventasData.slice(0, 10))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    )
  }

  // Preparar datos para gráfico de líneas (últimos 30 días)
  const lineChartData = stats?.ventas_por_dia?.slice(-30).map((day: any) => ({
    fecha: new Date(day.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short" }),
    ganancias: day.total_ganancias,
  })) || []

  // Preparar datos para gráfico de barras (top 10 productos)
  const barChartData = stats?.top_productos?.slice(0, 10).map((producto: any) => ({
    nombre: producto.nombre.length > 15 ? producto.nombre.substring(0, 15) + "..." : producto.nombre,
    cantidad: producto.cantidad_total,
    ganancias: producto.ganancia_total,
  })) || []

  // Preparar datos para gráfico circular (ventas por categoría)
  const categoryStats: Record<string, number> = {}
  stats?.top_productos?.forEach((producto: any) => {
    const categoria = producto.categoria || "Sin categoría"
    categoryStats[categoria] = (categoryStats[categoria] || 0) + producto.ganancia_total
  })
  const pieChartData = Object.entries(categoryStats).map(([name, value]) => ({
    name,
    value,
  }))

  const promedioGanancia = stats?.resumen?.total_ventas > 0 
    ? stats.resumen.total_ganancias / stats.resumen.total_ventas 
    : 0

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-wine">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de ventas y ganancias</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-wine" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-wine">
              {formatPrice(stats?.resumen?.total_ganancias || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Del periodo seleccionado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas del Mes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-brand-brown" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.resumen?.total_ventas || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Transacciones realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Ganancia/Venta</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(promedioGanancia)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por transacción
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.productos_stock_bajo?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Menos de 5 unidades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Gráfico de Líneas - Ganancias últimos 30 días */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Ganancias - Últimos 30 Días</CardTitle>
          </CardHeader>
          <CardContent>
            {lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: any) => formatPrice(value)}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ganancias"
                    name="Ganancias"
                    stroke="#96305a"
                    strokeWidth={2}
                    dot={{ fill: "#96305a" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos de ventas para mostrar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Top 10 productos */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any, name: string) =>
                      name === "ganancias" ? formatPrice(value) : value
                    }
                  />
                  <Legend />
                  <Bar dataKey="cantidad" name="Unidades" fill="#b08e6b" />
                  <Bar dataKey="ganancias" name="Ganancias" fill="#96305a" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay productos vendidos
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico Circular - Ventas por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Ganancias por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatPrice(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No hay datos de categorías
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Últimas Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas 10 Ventas Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          {ultimasVentas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Img</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Ganancia</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasVentas.map((venta) => (
                  <TableRow key={venta.id}>
                    <TableCell>
                      {venta.productos?.imagen_url ? (
                        <div className="relative w-10 h-10 rounded overflow-hidden">
                          <Image
                            src={venta.productos.imagen_url}
                            alt={venta.productos.nombre}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-brand-cream" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {venta.productos?.nombre || "Producto eliminado"}
                    </TableCell>
                    <TableCell>
                      {venta.cliente_nombre || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{venta.cantidad}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(venta.precio_venta * venta.cantidad)}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatPrice(venta.ganancia)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(venta.fecha_venta)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay ventas registradas aún
            </p>
          )}
        </CardContent>
      </Card>

      {/* Alertas de Stock Bajo */}
      {stats?.productos_stock_bajo?.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {stats.productos_stock_bajo.map((producto: any) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div>
                    <p className="font-medium">{producto.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      Solo quedan {producto.stock} unidades
                    </p>
                  </div>
                  <Badge variant="destructive">{producto.stock}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
