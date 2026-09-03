"use client"

import { Check } from "lucide-react"

/**
 * Cercle doré avec check, léger effet d'apparition.
 * Animation locale (style jsx) pour rester autonome, respecte
 * prefers-reduced-motion sans dépendre du CSS global du projet.
 */
export default function OrderSuccessIcon() {
  return (
    <div className="mx-auto mb-6 flex justify-center">
      <div className="order-success-icon flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10">
        <Check size={30} strokeWidth={2.5} className="text-[#E8C97E]" aria-hidden="true" />
      </div>
      <style jsx>{`
        .order-success-icon {
          animation: order-success-pop 480ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes order-success-pop {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .order-success-icon {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}