import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

/**
 * Same-origin login bridge: the browser receives a secure httpOnly cookie while
 * Spring Boot remains the only authority that validates passwords and signs JWTs.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email ?? body.identifier ?? "").trim()
    const password = String(body.password ?? "")
    if (!email || !password) {
      return NextResponse.json({ error: { code: "MISSING_FIELDS", message: "Email and password are required" } }, { status: 400 })
    }

    const backendResponse = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const payload = await backendResponse.json().catch(() => ({}))
    if (!backendResponse.ok) {
      return NextResponse.json({ error: payload.error ?? { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } }, { status: backendResponse.status })
    }

    // Forward Spring's signed JWT from its Set-Cookie header to the Next.js origin.
    const setCookie = backendResponse.headers.get("set-cookie")
    const token = setCookie?.match(/kb-admin-token=([^;]+)/)?.[1]
    if (!token) return NextResponse.json({ error: { code: "INVALID_LOGIN_RESPONSE" } }, { status: 502 })

    const cookieStore = await cookies()
    cookieStore.set("kb-admin-token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(Number(payload.expiresIn ?? 28800000) / 1000),
    })
    return NextResponse.json({ success: true, email: payload.email })
  } catch {
    return NextResponse.json({ error: { code: "BACKEND_UNAVAILABLE", message: "Authentication service unavailable" } }, { status: 503 })
  }
}
