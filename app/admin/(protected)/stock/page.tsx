"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/app/providers/AppContext"
import { StatusToast } from "@/components/admin/StatusToast"
import type { Product } from "@/lib/store-types"
import { StockHistory, StockHistoryEntry } from "@/components/admin/StockHistory"
import { StockTable } from "@/components/admin/StockTable"
import { StockModal } from "@/components/admin/StockModal"

export default function AdminStockPage() {
  const { products, categories, refreshProducts, language, t } = useAppContext() as any
  const adminT = t("admin")
  const locale = language === "ar" ? "ar-MA" : "fr-FR"

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [history, setHistory] = useState<StockHistoryEntry[]>([])

  useEffect(() => {
    void refreshProducts()
  }, [refreshProducts])

  const handleConfirmStock = async (newQuantity: number) => {
    if (!editingProduct) return
    setIsSaving(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(`${API_URL}/products/${editingProduct.id}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: Number(newQuantity),
        }),
      })

      if (!response.ok) {
        throw new Error(adminT.stockUpdateFailed)
      }

      await refreshProducts()

      setHistory((prev) => [
        {
          id: `${editingProduct.id}-${Date.now()}`,
          productName: editingProduct.nameFr,
          previousQuantity: Number(editingProduct.quantity) || 0,
          newQuantity,
          timestamp: new Date().toLocaleString(locale),
        },
        ...prev,
      ])

      setToast({ message: adminT.stockSavedSuccess, type: "success" })
      setEditingProduct(null)
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : adminT.updateError, type: "error" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <StockTable products={products} categories={categories} onEditStock={setEditingProduct} />
      <StockHistory entries={history} />

      {editingProduct && (
        <StockModal
          product={editingProduct}
          isSaving={isSaving}
          onClose={() => setEditingProduct(null)}
          onConfirm={handleConfirmStock}
        />
      )}

      {toast && <StatusToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}