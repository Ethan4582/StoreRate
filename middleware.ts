import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const { pathname } = request.nextUrl

    const publicRoutes = ["/", "/login", "/register"]

    if (publicRoutes.includes(pathname)) {
      return NextResponse.next()
    }

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const user = verifyToken(token)
    if (!user) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }

    
    if (
      (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) &&
      user.role !== "system_admin"
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (pathname.startsWith("/store-owner") && user.role !== "store_owner") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
