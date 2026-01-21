import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = ["/admin"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Permitir acceso a la página de login sin autenticación
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Si es una ruta protegida, verificar autenticación
  if (isProtectedRoute) {
    const token = request.cookies.get("sb-access-token")

    if (!token) {
      // Redirigir a login si no está autenticado
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
