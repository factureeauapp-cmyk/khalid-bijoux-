"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/app/providers/AppContext"

export default function AdminLoginPage() {
  const { t } = useAppContext()
  const admin = t("admin")

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    console.log("=== LOGIN START ===")
    console.log("EMAIL =", email)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      console.log("LOGIN RESPONSE STATUS =", response.status)
      console.log("LOGIN RESPONSE =", data)

      if (!response.ok) {
        setError(data.message || "Identifiants invalides")
        return
      }

      if (!data.token) {
        setError("Aucun token reçu du serveur")
        console.error("TOKEN MANQUANT :", data)
        return
      }

      localStorage.setItem("adminToken", data.token)
      localStorage.setItem("adminEmail", data.email)

      console.log("TOKEN STOCKE =", localStorage.getItem("adminToken"))
      console.log("EMAIL STOCKE =", localStorage.getItem("adminEmail"))

      // ⚠️ Diagnostic : si un middleware.ts protège /admin/* via un cookie,
      // ce cookie n'existe jamais (le back-end ne renvoie pas de Set-Cookie,
      // seulement du JSON). On l'écrit ici aussi, en plus du localStorage,
      // pour qu'un éventuel middleware côté serveur puisse le lire.
      // Retire ce bloc si tu n'as pas de middleware, ou si tu préfères que
      // le back-end pose un cookie httpOnly lui-même (plus sûr).
      const maxAge = Math.floor(
        (data.expiresIn ?? 28800000) / 1000
      )
      
      document.cookie = `kb-admin-token=${encodeURIComponent(
        data.token
      )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${
        window.location.protocol === "https:" ? "; Secure" : ""
      }`

    console.log("COOKIE ECRIT =", document.cookie)

      console.log("REDIRECTION VERS /admin")
      window.location.href = "/admin"
    } catch (error) {
      console.error("Erreur login :", error)

      setError(
        "Impossible de se connecter au serveur. Vérifiez que le backend est démarré."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur"
      >
        <h1 className="mb-2 text-center text-4xl font-cormorant">
          {admin.loginTitle}
        </h1>

        <p className="mb-8 text-center text-sm text-white/60">
          Administration Khalid Bijoux
        </p>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={admin?.email}
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-[#c9a84c]"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={admin?.password}
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-[#c9a84c]"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Connexion..." : admin.login}
        </button>

        <div className="mt-6 text-center text-xs text-white/40">
          Version Administration
        </div>
      </form>
    </main>
  )
}
