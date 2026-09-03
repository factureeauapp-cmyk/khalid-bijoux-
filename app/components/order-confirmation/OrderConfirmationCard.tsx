"use client"

import OrderSuccessIcon from "./OrderSuccessIcon"
import OrderConfirmationHeader from "./OrderConfirmationHeader"
import OrderWhatsAppButton from "./OrderWhatsAppButton"
import OrderConfirmationNotice from "./OrderConfirmationNotice"
import ContinueShoppingButton from "./ContinueShoppingButton"
import type { WhatsAppOrderData } from "@/lib/whatsapp"

type Lang = "fr" | "ar"

interface OrderConfirmationCardProps {
  order: WhatsAppOrderData
  language: Lang
}

/**
 * Composant principal : orchestre les sous-composants, ne contient aucune
 * logique WhatsApp (déléguée à OrderWhatsAppButton + lib/whatsapp).
 */
export default function OrderConfirmationCard({ order, language }: OrderConfirmationCardProps) {
  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="order-confirmation-card mx-auto w-full max-w-xl rounded-[28px] border border-white/10 bg-white/5 p-6 text-center sm:p-10"
    >
      <OrderSuccessIcon />
      <OrderConfirmationHeader order={order} language={language} />

      <div className="my-8 border-t border-white/10" />

      <OrderWhatsAppButton order={order} language={language} />
      <OrderConfirmationNotice language={language} />

      <div className="my-8 border-t border-white/10" />

      <ContinueShoppingButton language={language} />

      <style jsx>{`
        .order-confirmation-card {
          animation: order-confirmation-in 420ms ease-out both;
        }
        @keyframes order-confirmation-in {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .order-confirmation-card {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}