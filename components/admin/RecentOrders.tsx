"use client"

import Link from "next/link"
import type { CustomerOrder } from "@/lib/store-types"
import { useAppContext } from "@/app/providers/AppContext"

interface RecentOrdersProps {
  orders: CustomerOrder[]
  limit?: number
}

export function RecentOrders({
  orders,
  limit = 5,
}: RecentOrdersProps) {
  const { t, language } = useAppContext()
  const admin = t("admin")

  const recent = orders.slice(0, limit)

  const STATUS_LABELS: Record<string, string> = {
    PENDING: admin.statusPending,
    CONFIRMED: admin.statusConfirmed,
    SHIPPED: admin.statusShipped,
    DELIVERED: admin.statusDelivered,
    CANCELLED: admin.statusCancelled,
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-cormorant text-white">
          {admin.recentOrders}
        </h2>

        <Link
          href="/admin/orders"
          className="text-sm font-medium text-[#c9a84c] transition hover:text-[#e3c46f]"
        >
          {admin.viewAll} →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-white/50">
          {admin.noOrders}
        </p>
      ) : (
        <ul className="divide-y divide-white/10">
          {recent.map((order) => (
            <li
              key={order.orderNumber}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium text-white">
                  {order.customer.firstName}{" "}
                  {order.customer.lastName}
                </p>

                <p className="text-xs text-white/40">
                  {order.orderNumber} •{" "}
                  {order.total.toLocaleString(
                    language === "ar"
                      ? "ar-MA"
                      : "fr-FR"
                  )}{" "}
                  {admin.dh}
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                {STATUS_LABELS[order.status] ??
                  order.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}