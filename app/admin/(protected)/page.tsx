"use client"

import { useEffect } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { StockDashboard } from "@/components/admin/StockDashboard"
import { RecentOrders } from "@/components/admin/RecentOrders"
import { DashboardCards } from "@/components/admin/Dashboardcards"
import { DashboardCharts } from "@/components/admin/Dashboardcharts"

/**
 * app/admin/(protected)/page.tsx — Dashboard.
 * Structure : 4 cartes hero (chiffres prioritaires) → graphique + commandes
 * récentes → détail du stock. Aucune logique métier modifiée, uniquement
 * la présentation et l'organisation visuelle.
 */
export default function AdminDashboardPage() {
  const { products, categories, orders, refreshProducts, refreshCategories, refreshOrders } = useAppContext()

  useEffect(() => {
    void refreshProducts()
    void refreshCategories()
    void refreshOrders()
  }, [refreshProducts, refreshCategories, refreshOrders])

  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardCards products={products} orders={orders} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <DashboardCharts products={products} categories={categories} />
        <RecentOrders orders={orders} />
      </div>

      <StockDashboard products={products} />
    </div>
  )
}