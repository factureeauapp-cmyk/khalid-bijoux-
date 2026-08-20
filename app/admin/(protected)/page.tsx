"use client"

import { useEffect } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { StockDashboard } from "@/components/admin/StockDashboard"
import { RecentOrders } from "@/components/admin/RecentOrders"
import { DashboardCards } from "@/components/admin/Dashboardcards"
import { DashboardCharts } from "@/components/admin/Dashboardcharts"

export default function AdminDashboardPage() {
  const {
    products,
    categories,
    orders,
    refreshProducts,
    refreshCategories,
    refreshOrders,
  } = useAppContext()

  useEffect(() => {
    console.log("=== DASHBOARD MOUNT ===")
    console.log("TOKEN DASHBOARD =", localStorage.getItem("adminToken"))

    // ⚠️ L'ancienne vérification de token + router.replace ici a été
    // retirée : le layout parent (app/admin/(protected)/layout.tsx) bloque
    // déjà le rendu de cette page tant qu'il n'a pas confirmé la présence
    // du token (isCheckingAuth / isAuthenticated). Garder une seconde
    // vérification redondante ici ne cause pas de bug en soi, mais peut
    // dupliquer les redirections et complique le diagnostic — remets-la
    // si tu préfères une double sécurité explicite.

    void refreshProducts()
    void refreshCategories()
    void refreshOrders()
  }, [refreshProducts, refreshCategories, refreshOrders])

  return (
    <div className="space-y-6 sm:space-y-8">
      <DashboardCards products={products} orders={orders} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <DashboardCharts
          products={products}
          categories={categories}
        />
        <RecentOrders orders={orders} />
      </div>

      <StockDashboard products={products} />
    </div>
  )
}