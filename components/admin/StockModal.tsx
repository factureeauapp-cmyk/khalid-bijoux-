"use client"

import { useState } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import type { Product } from "@/lib/store-types"

interface StockModalProps {
  product: Product
  isSaving: boolean
  onClose: () => void
  onConfirm: (newQuantity: number) => void
}

/**
 * Modal "Modifier le stock".
 * Composant purement contrôlé : ne fait AUCUN appel API lui-même.
 * L'appel fetch (PATCH /products/:id/stock) reste dans stock/page.tsx,
 * exactement comme handleDelete/handleSubmit restent dans products/page.tsx.
 */
export function StockModal({ product, isSaving, onClose, onConfirm }: StockModalProps) {
  const { language, t } = useAppContext() as any
  const adminT = t("admin")
  const [quantity, setQuantity] = useState<number>(Number(product.quantity) || 0)

  const productName = language === "ar" && (product as any).nameAr ? (product as any).nameAr : product.nameFr

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
        <h3 className="font-cormorant text-xl text-white">{adminT.editStockTitle}</h3>
        <p className="mt-1 text-sm text-white/50">{productName}</p>

        <div className="mt-5">
          <label className="mb-2 block text-xs uppercase tracking-wide text-white/50">
            {adminT.stockQuantity}
          </label>
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#c9a84c]"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50"
          >
            {adminT.cancelBtn}
          </button>
          <button
            onClick={() => onConfirm(quantity)}
            disabled={isSaving}
            className="rounded-xl bg-[#c9a84c] px-4 py-2 text-sm font-medium text-black hover:bg-[#dab85c] disabled:opacity-50"
          >
            {isSaving ? adminT.saving : adminT.save}
          </button>
        </div>
      </div>
    </div>
  )
}