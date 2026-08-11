"use client"

import Link from "next/link"
import type { CustomerOrder } from "@/lib/store-types"
import { useAppContext } from "@/app/providers/AppContext"

interface RecentOrdersProps {
  orders: CustomerOrder[]
  limit?: number
}

const STATUS_BADGE: Record<string, string> = {
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  CONFIRMED: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  SHIPPED: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  DELIVERED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  CANCELLED: "border-rose-400/30 bg-rose-400/10 text-rose-300",
}

/**
 * Aperçu simplifié des dernières commandes : numéro/client, montant, statut.
 * Lecture seule — la gestion complète reste dans /admin/orders.
 */
export function RecentOrders({ orders, limit = 5 }: RecentOrdersProps) {
  const { t, language } = useAppContext()
  const admin = t("admin")
  const locale = language === "ar" ? "ar-MA" : "fr-FR"

  const STATUS_LABELS: Record<string, string> = {
    PENDING: admin.statusPending,
    CONFIRMED: admin.statusConfirmed,
    SHIPPED: admin.statusShipped,
    DELIVERED: admin.statusDelivered,
    CANCELLED: admin.statusCancelled,
  }

  const recent = orders.slice(0, limit)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-cormorant text-white sm:text-xl">{admin.recentOrders}</h2>
        <Link href="/admin/orders" className="text-xs font-medium text-[#c9a84c] hover:text-[#e3c46f] sm:text-sm">
          {admin.viewAll} →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-white/40">{admin.noOrdersYet}</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {recent.map((order) => (
            <li key={order.orderNumber} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-xs text-white/35">
                  {order.orderNumber} · {order.total.toLocaleString(locale)} MAD
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  STATUS_BADGE[order.status] ?? "border-white/15 bg-white/5 text-white/60"
                }`}
              >
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}