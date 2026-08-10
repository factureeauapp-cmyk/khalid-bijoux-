"use client"

import { useMemo } from "react"
import type { Product, CustomerOrder } from "@/lib/store-types"
import { useAppContext } from "@/app/providers/AppContext"

interface DashboardCardsProps {
  products: Product[]
  orders: CustomerOrder[]
}

/**
 * Cartes KPI du Dashboard
 *
 * - Lecture seule
 * - Aucune logique métier modifiée
 * - Les données proviennent uniquement de AppContext
 */
export function DashboardCards({
  products,
  orders,
}: DashboardCardsProps) {
  const { t, language } = useAppContext()
  const admin = t("admin")

  const stats = useMemo(() => {
    const totalProducts = products.length

    const totalStockValue = products.reduce(
      (sum, product) =>
        sum +
        (Number(product.price) || 0) *
          (Number(product.quantity) || 0),
      0
    )

    const pendingOrders = orders.filter(
      (order) => order.status === "PENDING"
    ).length

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0
    )

    return [
      {
        label: admin.totalProducts,
        value: totalProducts.toString(),
      },
      {
        label: admin.stockValue,
        value: `${totalStockValue.toLocaleString(
          language === "ar" ? "ar-MA" : "fr-FR"
        )} ${admin.dh}`,
      },
      {
        label: admin.totalRevenue,
        value: `${totalRevenue.toLocaleString(
          language === "ar" ? "ar-MA" : "fr-FR"
        )} ${admin.dh}`,
      },
      {
        label: admin.pendingOrders,
        value: pendingOrders.toString(),
      },
    ]
  }, [products, orders, admin, language])

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:border-[#c9a84c]/40 hover:bg-white/10"
        >
          <p className="text-sm text-white/60">
            {stat.label}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#c9a84c]">
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  )
}