import { Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/format-currency"
import type { WhatsAppOrderData } from "@/lib/whatsapp"

type Lang = "fr" | "ar"

interface OrderConfirmationHeaderProps {
  order: WhatsAppOrderData
  language: Lang
}

const COPY: Record<Lang, { title: string; subtitle: string; totalLabel: string }> = {
  fr: {
    title: "Commande enregistrée",
    subtitle: "Votre commande est en attente de confirmation.",
    totalLabel: "Total de la commande",
  },
  ar: {
    title: "تم تسجيل طلبك",
    subtitle: "طلبك في انتظار التأكيد.",
    totalLabel: "إجمالي الطلب",
  },
}

export default function OrderConfirmationHeader({ order, language }: OrderConfirmationHeaderProps) {
  const copy = COPY[language]

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-cormorant text-white sm:text-3xl">{copy.title}</h1>

      <div className="flex items-center justify-center gap-2 text-sm font-semibold tracking-wide text-[#E8C97E]">
        <Receipt size={16} aria-hidden="true" />
        <span>{order.orderNumber}</span>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{copy.totalLabel}</p>
        <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
          {formatCurrency(order.total, language)}
        </p>
      </div>

      <p className="mx-auto max-w-sm text-sm leading-6 text-white/60">{copy.subtitle}</p>
    </div>
  )
}