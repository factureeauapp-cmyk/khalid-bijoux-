"use client"

import { useState } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { SettingsCard } from "@/components/admin/SettingsCard"
import { StatusToast } from "@/components/admin/StatusToast"

type ResetStep = "request" | "verify" | "change"

export default function AdminSettingsPage() {
  const context = useAppContext()
  const { language, t } = context
  const adminT = t("admin")
  const setLanguage = context.setLanguage
  const [step, setStep] = useState<ResetStep>("request")
  const [otp, setOtp] = useState("")
  const [passwords, setPasswords] = useState({ next: "", confirm: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const callResetApi = async (path: string, body?: object) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.details?.[0] || payload.message || "Une erreur est survenue")
  }

  const requestCode = async () => {
    setIsSaving(true)
    try { await callResetApi("request-password-reset"); setStep("verify"); setToast({ message: "Un code à 6 chiffres a été envoyé à l’adresse administrateur.", type: "success" }) }
    catch (error) { setToast({ message: error instanceof Error ? error.message : adminT.genericError, type: "error" }) }
    finally { setIsSaving(false) }
  }
  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault(); setIsSaving(true)
    try { await callResetApi("verify-otp", { otp }); setStep("change"); setToast({ message: "Code vérifié. Choisissez votre nouveau mot de passe.", type: "success" }) }
    catch (error) { setToast({ message: error instanceof Error ? error.message : adminT.genericError, type: "error" }) }
    finally { setIsSaving(false) }
  }
  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    if (passwords.next !== passwords.confirm) { setToast({ message: adminT.passwordsDontMatch, type: "error" }); return }
    setIsSaving(true)
    try { await callResetApi("change-password", { otp, newPassword: passwords.next, confirmPassword: passwords.confirm }); setStep("request"); setOtp(""); setPasswords({ next: "", confirm: "" }); setToast({ message: adminT.passwordChangeSuccess, type: "success" }) }
    catch (error) { setToast({ message: error instanceof Error ? error.message : adminT.genericError, type: "error" }) }
    finally { setIsSaving(false) }
  }

  return <div className="space-y-6">
    <SettingsCard title={adminT.profileTitle} description={adminT.profileDescription}><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-lg font-medium text-[#c9a84c]">A</span><div><p className="text-white">{adminT.adminRole}</p><p className="text-sm text-white/50">{t("brandName")}</p></div></div></SettingsCard>
    <SettingsCard title={adminT.changePasswordTitle} description="Un code à usage unique, valable 5 minutes, protège cette opération.">
      {step === "request" && <button type="button" onClick={requestCode} disabled={isSaving} className="rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-medium text-black hover:bg-[#dab85c] disabled:opacity-50">{isSaving ? adminT.saving : "Envoyer un code de vérification"}</button>}
      {step === "verify" && <form onSubmit={verifyCode} className="space-y-4"><input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="Code à 6 chiffres" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a84c]" /><div className="flex gap-3"><button disabled={isSaving} className="rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-medium text-black disabled:opacity-50">{isSaving ? adminT.saving : "Vérifier le code"}</button><button type="button" onClick={requestCode} disabled={isSaving} className="text-sm text-[#c9a84c]">Renvoyer</button></div></form>}
      {step === "change" && <form onSubmit={changePassword} className="space-y-4"><input type="password" minLength={8} required placeholder={adminT.newPassword} value={passwords.next} onChange={(event) => setPasswords((previous) => ({ ...previous, next: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a84c]" /><input type="password" minLength={8} required placeholder={adminT.confirmNewPassword} value={passwords.confirm} onChange={(event) => setPasswords((previous) => ({ ...previous, confirm: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a84c]" /><button disabled={isSaving} className="rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-medium text-black disabled:opacity-50">{isSaving ? adminT.saving : adminT.updatePassword}</button></form>}
    </SettingsCard>
    <SettingsCard title={adminT.languageTitle} description={adminT.languageDescription}><div className="flex gap-3">{["fr", "ar"].map((lang) => <button key={lang} onClick={() => setLanguage?.(lang)} disabled={!setLanguage} className={`rounded-xl px-5 py-2 text-sm font-medium transition-colors ${language === lang ? "bg-[#c9a84c] text-black" : "border border-white/10 text-white hover:bg-white/10"} disabled:opacity-40`}>{lang === "fr" ? "Français" : "العربية"}</button>)}</div></SettingsCard>
    {toast && <StatusToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
  </div>
}
