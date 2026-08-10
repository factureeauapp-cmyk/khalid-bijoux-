"use client"

import { useState } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { SettingsCard } from "@/components/admin/SettingsCard"
import { StatusToast } from "@/components/admin/StatusToast"

export default function AdminSettingsPage() {
  const context = useAppContext() as any
  const { language, t } = context
  const adminT = t("admin")
  const setLanguage: ((lang: string) => void) | undefined = context.setLanguage

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/logout`, { method: "POST" })
    window.location.href = "/admin/login"
  }

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!passwords.current || !passwords.next) {
      setToast({ message: adminT.fillAllFields, type: "error" })
      return
    }
    if (passwords.next !== passwords.confirm) {
      setToast({ message: adminT.passwordsDontMatch, type: "error" })
      return
    }

    setIsSavingPassword(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(`${API_URL}/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.next,
        }),
      })

      if (!response.ok) throw new Error(adminT.passwordChangeError)

      setPasswords({ current: "", next: "", confirm: "" })
      setToast({ message: adminT.passwordChangeSuccess, type: "success" })
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : adminT.genericError, type: "error" })
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      <SettingsCard title={adminT.profileTitle} description={adminT.profileDescription}>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-lg font-medium text-[#c9a84c]">
            A
          </span>
          <div>
            <p className="text-white">{adminT.adminRole}</p>
            <p className="text-sm text-white/50">{t("brandName")}</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title={adminT.changePasswordTitle}>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder={adminT.currentPassword}
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a84c]"
          />
          <input
            type="password"
            placeholder={adminT.newPassword}
            value={passwords.next}
            onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a84c]"
          />
          <input
            type="password"
            placeholder={adminT.confirmNewPassword}
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a84c]"
          />
          <button
            type="submit"
            disabled={isSavingPassword}
            className="rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-medium text-black hover:bg-[#dab85c] disabled:opacity-50"
          >
            {isSavingPassword ? adminT.saving : adminT.updatePassword}
          </button>
        </form>
      </SettingsCard>

      <SettingsCard title={adminT.languageTitle} description={adminT.languageDescription}>
        <div className="flex gap-3">
          {["fr", "ar"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage?.(lang)}
              disabled={!setLanguage}
              className={`rounded-xl px-5 py-2 text-sm font-medium transition-colors ${
                language === lang
                  ? "bg-[#c9a84c] text-black"
                  : "border border-white/10 text-white hover:bg-white/10"
              } disabled:opacity-40`}
            >
              {lang === "fr" ? "Français" : "العربية"}
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title={adminT.logoutTitle}>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white hover:bg-white/10 transition-colors"
        >
          <span className="text-lg">↩</span>
          {adminT.logout}
        </button>
      </SettingsCard>

      {toast && <StatusToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}