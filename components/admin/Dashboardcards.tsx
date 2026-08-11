"use client"

import { useMemo } from "react"
import type { Product, CustomerOrder } from "@/lib/store-types"
import { useAppContext } from "@/app/providers/AppContext"

interface DashboardCardsProps {
  products: Product[]
  orders: CustomerOrder[]
}

/**
 * Cartes KPI "hero" du Dashboard — les 4 chiffres les plus importants,
 * avec une typographie prioritaire et un petit contexte sous chaque valeur.
 *
 * - Lecture seule, aucune logique métier modifiée (mêmes formules qu'avant)
 * - Devise uniformisée en "MAD" partout (au lieu du mélange DH/MAD)
 * - Les métriques plus fines (Disponibles/Rupture/Quantité totale) restent
 *   affichées, mais dans StockDashboard, au-dessus de la liste qu'elles
 *   résument — pour éviter de dupliquer les mêmes cartes deux fois sur la page.
 */
export function DashboardCards({ products, orders }: DashboardCardsProps) {
  const { t, language } = useAppContext()
  const admin = t("admin")
  const locale = language === "ar" ? "ar-MA" : "fr-FR"

  const stats = useMemo(() => {
    const totalProducts = products.length
    const availableProducts = products.filter((p) => (p.quantity ?? 0) > 0).length
    const outOfStockProducts = products.filter((p) => (p.quantity ?? 0) <= 0).length

    const totalStockValue = products.reduce(
      (sum, product) => sum + (Number(product.price) || 0) * (Number(product.quantity) || 0),
      0
    )

    const pendingOrders = orders.filter((order) => order.status === "PENDING").length

    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)

    return [
      {
        label: admin.totalProducts,
        value: totalProducts.toString(),
        context:
          outOfStockProducts > 0
            ? `${availableProducts} ${admin.availableProducts.toLowerCase()} · ${outOfStockProducts} ${admin.outOfStock.toLowerCase()}`
            : `${availableProducts} ${admin.availableProducts.toLowerCase()}`,
      },
      {
        label: admin.stockValue,
        value: `${totalStockValue.toLocaleString(locale)} MAD`,
        context: `${products.reduce((s, p) => s + (Number(p.quantity) || 0), 0)} ${admin.units}`,
      },
      {
        label: admin.totalRevenue,
        value: `${totalRevenue.toLocaleString(locale)} MAD`,
        context: `${orders.length} ${admin.orders.toLowerCase()}`,
      },
      {
        label: admin.pendingOrders,
        value: pendingOrders.toString(),
        context: pendingOrders > 0 ? undefined : undefined,
        accent: pendingOrders > 0,
      },
    ]
  }, [products, orders, admin, locale])

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border bg-white/[0.03] p-5 transition-colors sm:p-6 ${
            stat.accent ? "border-[#c9a84c]/40" : "border-white/10 hover:border-white/20"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-white/45">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold leading-none text-white sm:text-4xl">{stat.value}</p>
          {stat.context && <p className="mt-2 text-xs text-white/35">{stat.context}</p>}
        </div>
      ))}
    </div>
  )
}