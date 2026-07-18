"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/app/providers/AppContext"

export default function AdminLoginPage() {
  const { t } = useAppContext()
  const admin = t("admin")
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    })

    if (!response.ok) {
      setError("Identifiants invalides")
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8">
        <h1 className="mb-6 text-4xl font-cormorant">{admin.loginTitle}</h1>
        <div className="space-y-4">
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder={admin.username} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={admin.password} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button className="btn-primary mt-6 w-full">{admin.login}</button>
      </form>
    </main>
  )
}
