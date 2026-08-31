import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAdminJwt } from "@/lib/auth/jwt"

const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
])

async function hasValidToken(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("kb-admin-token")?.value

  console.log(
    "AUTH COOKIE =",
    token ? "PRESENT" : "ABSENT"
  )

  if (!token) {
    return false
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    console.error("AUTH ERROR: JWT_SECRET is not configured")
    return false
  }

  try {
    const payload = await verifyAdminJwt(token, secret)

    console.log(
      "AUTH JWT =",
      payload ? "VALIDE" : "INVALIDE"
    )

    return Boolean(payload)
  } catch (error) {
    console.error(
      "AUTH JWT VERIFICATION ERROR =",
      error
    )

    return false
  }
}

function unauthorizedApiResponse() {
  return NextResponse.json(
    { error: "UNAUTHORIZED" },
    { status: 401 }
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log("================================")
  console.log("=== PROXY ===")
  console.log("METHOD =", request.method)
  console.log("PATH =", pathname)

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    console.log("PUBLIC PATH -> ALLOW")

    return NextResponse.next()
  }

  // ==========================================
  // TOKEN
  // ==========================================

  const token = request.cookies.get(
    "kb-admin-token"
  )?.value

  console.log(
    "TOKEN =",
    token ? "PRESENT" : "ABSENT"
  )

  // ==========================================
  // PROTECTED ADMIN PAGE
  // ==========================================

  const needsAdminPageAuth =
    pathname.startsWith("/admin")

  // ==========================================
  // PROTECTED ADMIN API
  // ==========================================

  const needsAdminApiAuth =
    (
      pathname.startsWith("/api/products") &&
      request.method !== "GET"
    ) ||
    (
      pathname.startsWith("/api/orders") &&
      request.method !== "POST"
    ) ||
    pathname.startsWith("/api/admin/logout")

  // ==========================================
  // PUBLIC ROUTE
  // ==========================================

  if (
    !needsAdminPageAuth &&
    !needsAdminApiAuth
  ) {
    console.log("PUBLIC ROUTE -> ALLOW")

    return NextResponse.next()
  }

  // ==========================================
  // JWT VALIDATION
  // ==========================================

  const validToken = await hasValidToken(request)

  if (validToken) {
    console.log("VALID TOKEN -> ALLOW")

    return NextResponse.next()
  }

  // ==========================================
  // API UNAUTHORIZED
  // ==========================================

  if (needsAdminApiAuth) {
    console.log("API UNAUTHORIZED -> 401")

    return unauthorizedApiResponse()
  }

  // ==========================================
  // ADMIN PAGE -> LOGIN
  // ==========================================

  console.log(
    "ADMIN PAGE UNAUTHORIZED -> REDIRECT LOGIN"
  )

  const loginUrl = new URL(
    "/admin/login",
    request.url
  )

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/orders/:path*",
    "/api/admin/:path*",
  ],
}
