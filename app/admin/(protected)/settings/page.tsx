"use client"

import { useState } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { SettingsCard } from "@/components/admin/SettingsCard"
import { StatusToast } from "@/components/admin/StatusToast"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

type ResetStep = "request" | "verify" | "change"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

export default function AdminSettingsPage() {
  const context = useAppContext()

  const { language, t } = context
  const adminT = t("admin")
  const setLanguage = context.setLanguage

  const [step, setStep] = useState<ResetStep>("request")

  const [otp, setOtp] = useState("")

  const [passwords, setPasswords] = useState({
    next: "",
    confirm: "",
  })



  const [isSaving, setIsSaving] = useState(false)

  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const router = useRouter()

  const { logout } = useAppContext()



  // ============================================================
  // RÉCUPÉRER LE TOKEN ADMIN
  // ============================================================

  const getAuthToken = (): string | null => {
    if (typeof window === "undefined") {
      return null
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("adminToken")




    return token
  }

  // ============================================================
  // APPEL API PASSWORD RESET
  // ============================================================

  const callResetApi = async (
    path: string,
    body?: Record<string, unknown>
  ) => {
    const token = getAuthToken()

    if (!token) {
      throw new Error(
        "Token administrateur introuvable. Veuillez vous reconnecter."
      )
    }

    const url = `${API_BASE_URL}/admin/${path}`

    console.log("======================================")
    console.log("ADMIN PASSWORD API")
    console.log("URL:", url)
    console.log("METHOD: POST")
    console.log("TOKEN PRESENT:", Boolean(token))
    console.log("======================================")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }

    console.log("Request headers:", {
      "Content-Type": headers["Content-Type"],
      Accept: headers["Accept"],
      Authorization: "Bearer [JWT]",
    })

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    console.log("Response status:", response.status)

    const payload = await response.json().catch(() => ({}))

    console.log("Response payload:", payload)

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Session administrateur expirée ou token invalide. Veuillez vous reconnecter."
        )
      }

      if (response.status === 403) {
        throw new Error(
          "Accès refusé. Votre compte ne possède pas les droits administrateur."
        )
      }

      throw new Error(
        payload?.details?.[0] ||
        payload?.message ||
        "Une erreur est survenue."
      )
    }

    return payload
  }

  // ============================================================
  // ÉTAPE 1 : ENVOYER OTP
  // ============================================================

  const requestCode = async () => {
    if (isSaving) return

    setIsSaving(true)

    try {
      await callResetApi("request-password-reset")

      console.log("OTP envoyé avec succès")

      setOtp("")

      setStep("verify")

      setToast({
        message:
          "Le code de vérification a été envoyé à votre adresse email administrateur.",
        type: "success",
      })
    } catch (error) {
      console.error("Erreur request-password-reset:", error)

      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Impossible d'envoyer le code de vérification.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // ============================================================
  // ÉTAPE 2 : VÉRIFIER OTP
  // ============================================================

  const verifyCode = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (otp.length !== 6) {
      setToast({
        message: "Veuillez saisir un code à 6 chiffres.",
        type: "error",
      })

      return
    }

    if (isSaving) return

    setIsSaving(true)

    try {
      await callResetApi("verify-otp", {
        otp,
      })

      console.log("OTP vérifié avec succès")

      setStep("change")

      setToast({
        message:
          "Code vérifié avec succès. Vous pouvez maintenant définir votre nouveau mot de passe.",
        type: "success",
      })
    } catch (error) {
      console.error("Erreur verify-otp:", error)

      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Code OTP invalide ou expiré.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // ============================================================
  // ÉTAPE 3 : CHANGER MOT DE PASSE
  // ============================================================

  const changePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (passwords.next.length < 8) {
      setToast({
        message:
          "Le nouveau mot de passe doit contenir au moins 8 caractères.",
        type: "error",
      })

      return
    }

    if (passwords.next !== passwords.confirm) {
      setToast({
        message:
          adminT.passwordsDontMatch ||
          "Les mots de passe ne correspondent pas.",
        type: "error",
      })

      return
    }

    if (isSaving) return

    setIsSaving(true)

    try {
      await callResetApi("change-password", {
        otp,
        newPassword: passwords.next,
        confirmPassword: passwords.confirm,
      })

      console.log("Mot de passe modifié avec succès")

      // Reset complet du workflow
      setStep("request")

      setOtp("")

      setPasswords({
        next: "",
        confirm: "",
      })

      setToast({
        message:
          adminT.passwordChangeSuccess ||
          "Mot de passe modifié avec succès.",
        type: "success",
      })
    } catch (error) {
      console.error("Erreur change-password:", error)

      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Impossible de modifier le mot de passe.",
        type: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // ============================================================
  // ANNULER LE WORKFLOW
  // ============================================================

  const cancelReset = () => {
    if (isSaving) return

    setStep("request")

    setOtp("")

    setPasswords({
      next: "",
      confirm: "",
    })
  }

  const handleLogout = () => {
    if (logout) {
      logout()
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("adminToken")
    }

    router.replace("/admin/login")
  }

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <div className="space-y-6">
      {/* ====================================================== */}
      {/* PROFIL ADMINISTRATEUR */}
      {/* ====================================================== */}

      <SettingsCard
        title={adminT.profileTitle}
        description={adminT.profileDescription}
      >
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 text-lg font-medium text-[#c9a84c]">
            A
          </span>

          <div>
            <p className="text-white">
              {adminT.adminRole}
            </p>

            <p className="text-sm text-white/50">
              {t("brandName")}
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* ====================================================== */}
      {/* CHANGEMENT MOT DE PASSE */}
      {/* ====================================================== */}

      <SettingsCard
        title={adminT.changePasswordTitle}
        description="Un code de vérification envoyé par email protège cette opération."
      >
        {/* ==================================================== */}
        {/* STEPPER */}
        {/* ==================================================== */}

        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max items-center gap-2">
            {/* STEP 1 */}
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${step === "request"
                  ? "bg-[#c9a84c] text-black"
                  : "bg-white/10 text-white/60"
                }`}
            >
              <span>1</span>
              <span>Email</span>
            </div>

            <span className="text-white/30">
              →
            </span>

            {/* STEP 2 */}
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${step === "verify"
                  ? "bg-[#c9a84c] text-black"
                  : step === "change"
                    ? "bg-white/10 text-white/60"
                    : "bg-white/5 text-white/30"
                }`}
            >
              <span>2</span>
              <span>OTP</span>
            </div>

            <span className="text-white/30">
              →
            </span>

            {/* STEP 3 */}
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${step === "change"
                  ? "bg-[#c9a84c] text-black"
                  : "bg-white/5 text-white/30"
                }`}
            >
              <span>3</span>
              <span>Nouveau mot de passe</span>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* ÉTAPE 1 */}
        {/* ==================================================== */}

        {step === "request" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/10 text-[#c9a84c]">
                  ✉
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white">
                    Vérification par email
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    Cliquez sur le bouton ci-dessous pour recevoir
                    un code OTP à 6 chiffres sur votre adresse email
                    administrateur.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={requestCode}
              disabled={isSaving}
              className="rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-medium text-black transition-all hover:bg-[#dab85c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? "Envoi en cours..."
                : "Envoyer le code de vérification"}
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* ÉTAPE 2 */}
        {/* ==================================================== */}

        {step === "verify" && (
          <form
            onSubmit={verifyCode}
            className="space-y-5"
          >
            <div className="rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/5 p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/10 text-[#c9a84c]">
                  ✓
                </div>

                <div>
                  <h3 className="text-sm font-medium text-white">
                    Code envoyé
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    Consultez votre boîte email et saisissez le
                    code de vérification reçu.
                  </p>

                  <p className="mt-2 text-xs text-white/40">
                    Le code est valable pendant 5 minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* OTP */}
            <div>
              <label
                htmlFor="admin-otp"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Code de vérification
              </label>

              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={otp}
                onChange={(event) => {
                  const value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)

                  setOtp(value)
                }}
                placeholder="000000"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] text-white outline-none transition focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30"
              />

              <p className="mt-2 text-xs text-white/40">
                {otp.length}/6 chiffres
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isSaving || otp.length !== 6}
                className="rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-medium text-black transition-all hover:bg-[#dab85c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Vérification..."
                  : "Vérifier le code"}
              </button>

              <button
                type="button"
                onClick={requestCode}
                disabled={isSaving}
                className="text-sm font-medium text-[#c9a84c] transition hover:text-[#dab85c] hover:underline disabled:opacity-50"
              >
                Renvoyer le code
              </button>

              <button
                type="button"
                onClick={cancelReset}
                disabled={isSaving}
                className="text-sm text-white/50 transition hover:text-white disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* ==================================================== */}
        {/* ÉTAPE 3 */}
        {/* ==================================================== */}

        {step === "change" && (
          <form
            onSubmit={changePassword}
            className="space-y-5"
          >
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                  ✓
                </div>

                <div>
                  <h3 className="text-sm font-medium text-green-400">
                    Code vérifié
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    Votre code est valide. Vous pouvez maintenant
                    définir votre nouveau mot de passe.
                  </p>
                </div>
              </div>
            </div>

            {/* NOUVEAU MOT DE PASSE */}
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Nouveau mot de passe
              </label>

              <input
                id="new-password"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
                placeholder={adminT.newPassword}
                value={passwords.next}
                onChange={(event) =>
                  setPasswords((previous) => ({
                    ...previous,
                    next: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30"
              />

              <p className="mt-2 text-xs text-white/40">
                Minimum 8 caractères.
              </p>
            </div>

            {/* CONFIRMATION */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Confirmer le nouveau mot de passe
              </label>

              <input
                id="confirm-password"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
                placeholder={adminT.confirmNewPassword}
                value={passwords.confirm}
                onChange={(event) =>
                  setPasswords((previous) => ({
                    ...previous,
                    confirm: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30"
              />
            </div>

            {/* VALIDATION */}
            {passwords.confirm.length > 0 && (
              <div
                className={`rounded-xl border p-3 text-sm ${passwords.next === passwords.confirm
                    ? "border-green-500/20 bg-green-500/5 text-green-400"
                    : "border-red-500/20 bg-red-500/5 text-red-400"
                  }`}
              >
                {passwords.next === passwords.confirm
                  ? "✓ Les mots de passe correspondent."
                  : "✕ Les mots de passe ne correspondent pas."}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={
                  isSaving ||
                  passwords.next.length < 8 ||
                  passwords.next !== passwords.confirm
                }
                className="rounded-xl bg-[#c9a84c] px-5 py-3 text-sm font-medium text-black transition-all hover:bg-[#dab85c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Modification..."
                  : adminT.updatePassword}
              </button>

              <button
                type="button"
                onClick={cancelReset}
                disabled={isSaving}
                className="text-sm text-white/50 transition hover:text-white disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </SettingsCard>

      {/* ====================================================== */}
      {/* LANGUE */}
      {/* ====================================================== */}

      <SettingsCard
        title={adminT.languageTitle}
        description={adminT.languageDescription}
      >
        <div className="flex gap-3">
          {["fr", "ar"].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage?.(lang)}
              disabled={!setLanguage}
              className={`rounded-xl px-5 py-2 text-sm font-medium transition-colors ${language === lang
                  ? "bg-[#c9a84c] text-black"
                  : "border border-white/10 text-white hover:bg-white/10"
                } disabled:opacity-40`}
            >
              {lang === "fr"
                ? "Français"
                : "العربية"}
            </button>
          ))}
        </div>
      </SettingsCard>





      <SettingsCard
        title="Déconnexion"
        description="Déconnectez-vous de votre espace administrateur sur cet appareil."
      >
        <button
          type="button"
          onClick={handleLogout}
          className="
      inline-flex items-center gap-2
      rounded-xl
      border border-red-500/30
      bg-red-500/10
      px-5 py-3
      text-sm font-medium
      text-red-400
      transition-all
      hover:border-red-500/50
      hover:bg-red-500/20
      hover:text-red-300
      active:scale-[0.98]
    "
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </SettingsCard>

      {/* ====================================================== */}
      {/* TOAST */}
      {/* ====================================================== */}

      {toast && (
        <StatusToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}