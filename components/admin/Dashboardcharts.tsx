"use client"

import { useMemo } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import type { Product } from "@/lib/store-types"

interface DashboardChartsProps {
  products: Product[]
  categories: {
    id: string
    nameFr: string
    nameAr: string
  }[]
}

/**
 * Graphique du stock par catégorie.
 *
 * - Lecture seule
 * - Aucune logique métier
 * - Aucune dépendance externe
 */
export function DashboardCharts({
  products,
  categories,
}: DashboardChartsProps) {
  const { t, language } = useAppContext()
  const admin = t("admin")

  const data = useMemo(() => {
    const byCategory = categories.map((category) => {
      const quantity = products
        .filter((product) => product.categoryId === category.id)
        .reduce(
          (sum, product) => sum + (Number(product.quantity) || 0),
          0
        )

      return {
        label:
          language === "ar"
            ? category.nameAr
            : category.nameFr,
        value: quantity,
      }
    })

    const max = Math.max(
      1,
      ...byCategory.map((item) => item.value)
    )

    return {
      byCategory,
      max,
    }
  }, [products, categories, language])

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h2 className="mb-6 text-2xl font-cormorant text-white">
        {admin.stockByCategory}
      </h2>

      {data.byCategory.length === 0 ? (
        <p className="text-sm text-white/50">
          {admin.noCategories}
        </p>
      ) : (
        <div className="space-y-5">
          {data.byCategory.map((row) => (
            <div key={row.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-white/80">
                  {row.label}
                </span>

                <span className="font-semibold text-[#c9a84c]">
                  {row.value}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#c9a84c] transition-all duration-500"
                  style={{
                    width: `${(row.value / data.max) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}