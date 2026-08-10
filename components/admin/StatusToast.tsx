"use client"

import { useEffect } from "react"
import { CheckCircle2, AlertTriangle, X } from "lucide-react"
import { useAppContext } from "@/app/providers/AppContext"

interface StatusToastProps {
  message: string
  type: "success" | "error"
  onClose: () => void
}

export function StatusToast({ message, type, onClose }: StatusToastProps) {
  const { language, t } = useAppContext() as any
  const adminT = t("admin")

  useEffect(() => {
    const timer = window.setTimeout(onClose, 3200)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  return (
    <div
      className="fixed bottom-6 right-6 z-[60] max-w-sm rounded-2xl border border-white/10 bg-[#111111]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-3">
        {type === "success" ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-400" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label={adminT.close}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}