"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: { email: string } | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const restoreSession = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("kb_token") : null
      if (!token) {
        setUser(null)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new AuthError("Session expired")
      }

      const payload = await response.json()
      setUser({ email: payload.email })
    } catch {
      setUser(null)
      window.localStorage.removeItem("kb_token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void restoreSession()
  }, [restoreSession])

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      throw new AuthError(payload.message || "Identifiants invalides")
    }

    const payload = await response.json()
    const token = payload.token as string | undefined
    if (!token) {
      throw new AuthError("Token absent")
    }

    window.localStorage.setItem("kb_token", token)
    setUser({ email })
    router.push("/admin")
  }, [router])

  const logout = useCallback(async () => {
    const token = window.localStorage.getItem("kb_token")
    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    }
    window.localStorage.removeItem("kb_token")
    setUser(null)
    router.push("/admin/login")
  }, [router])

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  }), [isLoading, login, logout, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
