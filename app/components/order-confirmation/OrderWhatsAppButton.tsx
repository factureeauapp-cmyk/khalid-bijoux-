"use client"

import { useState } from "react"
import { buildWhatsAppOrderMessage, buildWhatsAppUrl, type WhatsAppOrderData } from "@/lib/whatsapp"
import WhatsAppIcon from "../icon/WhatsAppIcon"


type Lang = "fr" | "ar"

interface OrderWhatsAppButtonProps {
  order: WhatsAppOrderData
  language: Lang
}

const COPY: Record<Lang, { cta: string; opened: string; missingNumber: string }> = {
  fr: {
    cta: "Confirmer ma commande via WhatsApp",
    opened: "WhatsApp a été ouvert.",
    missingNumber: "Le contact WhatsApp n'est pas configuré.",
  },
  ar: {
    cta: "تأكيد طلبي عبر واتساب",
    opened: "تم فتح واتساب.",
    missingNumber: "لم يتم إعداد رقم واتساب.",
  },
}

/**
 * N'envoie JAMAIS le message automatiquement : ouvre uniquement WhatsApp
 * avec un message prérempli. Le statut de la commande (PENDING) n'est
 * jamais modifié ici.
 */
export default function OrderWhatsAppButton({ order, language }: OrderWhatsAppButtonProps) {
  const [error, setError] = useState("")
  const [opened, setOpened] = useState(false)
  const copy = COPY[language]

  const handleClick = () => {
    const message = buildWhatsAppOrderMessage(order, language)
    const url = buildWhatsAppUrl(message)

    if (!url) {
      setError(copy.missingNumber)
      return
    }

    setError("")
    window.open(url, "_blank", "noopener,noreferrer")
    setOpened(true)
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        aria-label={copy.cta}
        className="group flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-linear-to-r from-[#C9A84C] via-[#E8C97E] to-[#C9A84C] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#0D0D0D] shadow-[0_12px_35px_rgba(201,168,76,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C97E]"
      >
        <WhatsAppIcon className="h-[18px] w-[18px] shrink-0 text-[#25D366] transition-transform duration-300 group-hover:scale-110" />
        <span>{copy.cta}</span>
      </button>

      {error && (
        <p role="alert" className="mt-3 text-sm text-rose-400">
          {error}
        </p>
      )}

      {opened && !error && (
        <p className="mt-3 text-xs text-white/40">{copy.opened}</p>
      )}
    </div>
  )
}