"use client"

import {
  AlertTriangle,
  Boxes,
  PackageCheck,
  TrendingUp,
  Warehouse,
} from "lucide-react"

import { useAppContext } from "@/app/providers/AppContext"
import type { Product } from "@/lib/store-types"

interface StockDashboardProps {
  products: Product[]
}

export function StockDashboard({ products }: StockDashboardProps) {
  const { t, language } = useAppContext()
  const admin = t("admin")

  const getStockStatus = (quantity?: number) => {
    if (!quantity || quantity <= 0) {
      return {
        label: admin.outOfStockLabel,
        tone: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      }
    }

    if (quantity <= 10) {
      return {
        label: admin.lowStock,
        tone: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      }
    }

    return {
      label: admin.stockAvailable,
      tone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    }
  }

  const totalProducts = products.length

  const availableProducts = products.filter(
    (product) => (product.quantity ?? 0) > 0
  ).length

  const outOfStockProducts = products.filter(
    (product) => (product.quantity ?? 0) <= 0
  ).length

  const totalQuantity = products.reduce(
    (sum, product) => sum + (product.quantity ?? 0),
    0
  )

  const totalValue = products.reduce(
    (sum, product) =>
      sum + (product.price ?? 0) * (product.quantity ?? 0),
    0
  )

  const lowStockProducts = products.filter(
    (product) =>
      (product.quantity ?? 0) > 0 &&
      (product.quantity ?? 0) <= 5
  )

  const cards = [
    {
      label: admin.totalProductsLabel,
      value: totalProducts,
      icon: PackageCheck,
    },
    {
      label: admin.availableProducts,
      value: availableProducts,
      icon: Boxes,
    },
    {
      label: admin.outOfStock,
      value: outOfStockProducts,
      icon: AlertTriangle,
    },
    {
      label: admin.totalQuantity,
      value: totalQuantity,
      icon: Warehouse,
    },
    {
      label: admin.stockValue,
      value: `${totalValue.toLocaleString(
        language === "ar" ? "ar-MA" : "fr-FR"
      )} ${admin.mad}`,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-white/60">
                {card.label}
              </p>

              <card.icon className="h-5 w-5 text-[#c9a84c]" />
            </div>

            <h2 className="text-3xl font-bold text-white">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-cormorant text-white">
              {admin.stockOverview}
            </h3>

            <span className="text-sm text-white/60">
              {products.length} {admin.productsCount}
            </span>
          </div>

          <div className="space-y-3">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.quantity)

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white">
                      {language === "ar"
                        ? product.nameAr
                        : product.nameFr}
                    </p>

                    <p className="text-sm text-white/50">
                      {product.categoryId ||
                        admin.withoutCategory}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-white/80">
                      {product.quantity ?? 0} {admin.units}
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs ${stockStatus.tone}`}
                    >
                      {stockStatus.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-cormorant text-white">
              {admin.stockWarning}
            </h3>

            <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs text-rose-400">
              {lowStockProducts.length}
            </span>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">
                      {language === "ar"
                        ? product.nameAr
                        : product.nameFr}
                    </p>

                    <span className="text-sm text-rose-300">
                      {product.quantity ?? 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60">
                {admin.noLowStock}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}