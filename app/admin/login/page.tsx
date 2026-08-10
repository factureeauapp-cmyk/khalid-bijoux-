"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/app/providers/AppContext"

export default function AdminLoginPage() {
  const { t } = useAppContext()
  const admin = t("admin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    // Call the internal Next.js route which sets the `kb-admin-token` cookie
    const response = await fetch(`/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      setError("Identifiants invalides")
      return
    }

    const data = await response.json();

    if (!response.ok) {
      setError("Identifiants invalides");
      return;
    }


    console.log("Login OK");
    console.log(data);

    // Server route sets httpOnly cookie; optionally store email for UI
    localStorage.setItem("adminEmail", data.email ?? email);

    console.log("Avant redirect");

    router.replace("/admin");


  }



  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8">
        <h1 className="mb-6 text-4xl font-cormorant">{admin.loginTitle}</h1>
        <div className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={admin?.email} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={admin?.password} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none" />
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button className="btn-primary mt-6 w-full">{admin.login}</button>
      </form>
    </main>
  )
}
