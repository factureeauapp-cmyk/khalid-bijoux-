"use client"

import Image from "next/image"
import { useAppContext } from "@/app/providers/AppContext"
import type { Product } from "@/lib/store-types"

interface Category {
  id: string
  nameFr: string
  nameAr?: string
}

interface StockTableProps {
  products: Product[]
  categories: Category[]
  onEditStock: (product: Product) => void
}

/**
 * Tableau moderne du stock : Image / Nom / Catégorie / Prix / Stock / Statut / Actions.
 * Purement présentationnel — la mutation du stock passe par onEditStock,
 * qui ouvre la StockModal depuis stock/page.tsx.
 */
export function StockTable({ products, categories, onEditStock }: StockTableProps) {
  const { language, t } = useAppContext() as any
  const adminT = t("admin")

  const getStatus = (quantity: number): { label: string; className: string } => {
    if (quantity <= 0)
      return { label: adminT.outOfStockLabel, className: "bg-red-500/15 text-red-400 border-red-500/30" }
    if (quantity <= 3)
      return { label: adminT.lowStock, className: "bg-amber-500/15 text-amber-400 border-amber-500/30" }
    return { label: adminT.stockAvailable, className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" }
  }

  const categoryName = (id?: string) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return adminT.withoutCategory
    return language === "ar" && category.nameAr ? category.nameAr : category.nameFr
  }

  const productName = (product: Product) =>
    language === "ar" && (product as any).nameAr ? (product as any).nameAr : product.nameFr

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/50">
              <th className="px-5 py-4">{adminT.imageLabel}</th>
              <th className="px-5 py-4">{adminT.nameLabel}</th>
              <th className="px-5 py-4">{adminT.categoryLabel}</th>
              <th className="px-5 py-4">{adminT.priceLabel}</th>
              <th className="px-5 py-4">{adminT.quantityLabel}</th>
              <th className="px-5 py-4">{adminT.statusLabel}</th>
              <th className="px-5 py-4 text-right">{adminT.actionsLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => {
              const status = getStatus(Number(product.quantity) || 0)
              return (
                <tr key={product.id} className="transition-colors hover:bg-white/[0.04]">
                  <td className="px-5 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black">
                      <Image src={product.image} alt={productName(product)} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-white">{productName(product)}</td>
                  <td className="px-5 py-3 text-white/70">{categoryName(product.categoryId)}</td>
                  <td className="px-5 py-3 text-white/70">
                    {product.price} {adminT.mad}
                  </td>
                  <td className="px-5 py-3 text-white">{product.quantity}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full border px-3 py-1 text-xs ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onEditStock(product)}
                      className="rounded-xl border border-[#c9a84c]/40 px-4 py-2 text-xs font-medium text-[#c9a84c] hover:bg-[#c9a84c]/10"
                    >
                      {adminT.editStock}
                    </button>
                  </td>
                </tr>
              )
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-white/40">
                  {adminT.noProductsToShow}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}