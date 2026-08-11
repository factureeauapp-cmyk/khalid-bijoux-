"use client"

import { useAppContext } from "@/app/providers/AppContext"
import type { Product } from "@/lib/store-types"

interface StockDashboardProps {
  products: Product[]
}

/**
 * Détail du stock : liste complète (produits à quantity=0 inclus, comme
 * demandé) + alertes de rupture proche.
 *
 * Les 5 cartes KPI qui existaient ici avant ont été retirées : elles
 * dupliquaient exactement "Produits" / "Valeur du stock" déjà affichés en
 * haut du Dashboard par DashboardCards. À la place, une barre compacte
 * (Disponibles / Rupture / Quantité totale) sert d'en-tête à la liste
 * qu'elle résume — même info, affichée une seule fois, au bon endroit.
 * Aucun calcul n'a changé.
 */
export function StockDashboard({ products }: StockDashboardProps) {
  const { t, language } = useAppContext()
  const admin = t("admin")

  const getStockStatus = (quantity?: number) => {
    if (!quantity || quantity <= 0) {
      return { label: admin.outOfStock, tone: "text-rose-400 bg-rose-500/10 border-rose-500/30" }
    }
    if (quantity <= 10) {
      return { label: admin.lowStock, tone: "text-amber-400 bg-amber-500/10 border-amber-500/30" }
    }
    return { label: admin.inStock, tone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" }
  }

  const availableProducts = products.filter((p) => (p.quantity ?? 0) > 0).length
  const outOfStockProducts = products.filter((p) => (p.quantity ?? 0) <= 0).length
  const totalQuantity = products.reduce((sum, p) => sum + (p.quantity ?? 0), 0)

  const lowStockProducts = products.filter((p) => (p.quantity ?? 0) > 0 && (p.quantity ?? 0) <= 5)

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-cormorant text-white sm:text-xl">{admin.stockOverview}</h3>

          {/* Barre compacte : remplace les 3 cartes dupliquées */}
          <div className="flex items-center gap-4 text-xs text-white/50">
            <span>
              <span className="font-medium text-emerald-400">{availableProducts}</span> {admin.availableProducts.toLowerCase()}
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span>
              <span className="font-medium text-rose-400">{outOfStockProducts}</span> {admin.outOfStock.toLowerCase()}
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span>
              <span className="font-medium text-white/80">{totalQuantity}</span> {admin.units}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.quantity)
            return (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {language === "ar" ? product.nameAr : product.nameFr}
                  </p>
                  <p className="text-xs text-white/35">{product.categoryId || admin.withoutCategory}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm text-white/60">
                    {product.quantity ?? 0} {admin.units}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${stockStatus.tone}`}>
                    {stockStatus.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-cormorant text-white sm:text-xl">{admin.stockWarning}</h3>
          <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs text-rose-400">
            {lowStockProducts.length}
          </span>
        </div>

        <div className="space-y-2">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-rose-500/15 bg-rose-500/5 px-4 py-3"
              >
                <p className="truncate text-sm font-medium text-white">
                  {language === "ar" ? product.nameAr : product.nameFr}
                </p>
                <span className="shrink-0 text-sm text-rose-300">{product.quantity ?? 0}</span>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-sm text-white/50">
              {admin.noLowStock}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}