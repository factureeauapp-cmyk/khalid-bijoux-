import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAdminJwt } from "@/lib/auth/jwt"

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login"])

async function hasValidToken(request: NextRequest) {
  const token = request.cookies.get("kb-admin-token")?.value
  const secret = process.env.JWT_SECRET ?? "change-me-in-env"

  if (!token) {
    return false
  }

  const payload = await verifyAdminJwt(token, secret)
  return Boolean(payload)
}

function unauthorizedApiResponse() {
  return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  const needsAdminPageAuth = pathname.startsWith("/admin")
  const needsAdminApiAuth =
    (pathname.startsWith("/api/products") && request.method !== "GET") ||
    (pathname.startsWith("/api/orders") && request.method !== "POST") ||
    pathname.startsWith("/api/admin/logout")

  if (!needsAdminPageAuth && !needsAdminApiAuth) {
    return NextResponse.next()
  }

  if (await hasValidToken(request)) {
    return NextResponse.next()
  }

  if (needsAdminApiAuth) {
    return unauthorizedApiResponse()
  }

  const loginUrl = new URL("/admin/login", request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/orders/:path*", "/api/admin/:path*"],
}
