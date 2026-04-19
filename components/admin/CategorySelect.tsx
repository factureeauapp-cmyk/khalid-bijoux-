"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, Plus, X, Trash2 } from "lucide-react"
import type { Category, Product } from "@/lib/store-types"

interface CategorySelectProps {
  categories: Category[]
  products: Product[]
  selectedCategoryId: string
  onSelectCategory: (categoryId: string) => void
  onCategoryDeleted?: () => void
  language: "fr" | "ar"
  isLoading?: boolean
}

export function CategorySelect({
  categories,
  products,
  selectedCategoryId,
  onSelectCategory,
  onCategoryDeleted,
  language,
  isLoading = false,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryFr, setNewCategoryFr] = useState("")
  const [newCategoryAr, setNewCategoryAr] = useState("")
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [showCategoryOptions, setShowCategoryOptions] = useState<string | null>(null)

  const selectedCategory = useMemo(() => categories.find((c) => c.id === selectedCategoryId), [categories, selectedCategoryId])

  const getCategoryLabel = (category: Category) => (language === "ar" ? category.nameAr : category.nameFr)

  const getProductsInCategory = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length
  }

  const handleCreateCategory = async () => {
    if (!newCategoryFr.trim() || !newCategoryAr.trim()) {
      setError("Les deux langues sont requises")
      return
    }

    setError("")
    setIsCreating(true)

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameFr: newCategoryFr, nameAr: newCategoryAr }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de la création")
      }

      const newCategory = await response.json()
      onSelectCategory(newCategory.id)
      setNewCategoryFr("")
      setNewCategoryAr("")
      setShowNewCategory(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création de la catégorie")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const productCount = getProductsInCategory(categoryId)
    if (productCount > 0) {
      setError(`Impossible de supprimer. Cette catégorie contient ${productCount} produit(s).`)
      return
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return

    setDeletingCategoryId(categoryId)
    setError("")

    try {
      const response = await fetch(`/api/categories/${categoryId}`, { method: "DELETE" })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      // If the deleted category was selected, select the first available
      if (selectedCategoryId === categoryId) {
        const remaining = categories.filter((c) => c.id !== categoryId)
        if (remaining.length > 0) {
          onSelectCategory(remaining[0].id)
        }
      }

      onCategoryDeleted?.()
      setShowCategoryOptions(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression")
    } finally {
      setDeletingCategoryId(null)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">Catégorie</label>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          ⚠️ Aucune catégorie disponible. Créez-en une d'abord.
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isLoading}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center justify-between text-left text-white disabled:opacity-50 hover:border-white/20 transition-colors"
          >
            <span>{selectedCategory ? getCategoryLabel(selectedCategory) : "Sélectionner une catégorie"}</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl z-50">
              <div className="max-h-60 overflow-y-auto">
                {categories.map((category) => {
                  const productCount = getProductsInCategory(category.id)
                  const isSelected = selectedCategoryId === category.id

                  return (
                    <div key={category.id} className="relative">
                      <div
                        className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCategory(category.id)
                            setIsOpen(false)
                          }}
                          className="flex-1 text-left"
                        >
                          <div className="font-medium">{getCategoryLabel(category)}</div>
                          <div className="text-xs text-white/40 mt-1">{productCount} produit(s)</div>
                        </button>
                        {categories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setShowCategoryOptions(showCategoryOptions === category.id ? null : category.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} className="text-rose-400" />
                          </button>
                        )}
                      </div>

                      {showCategoryOptions === category.id && (
                        <div className="border-t border-white/10 bg-black/50 px-4 py-3 space-y-2">
                          {productCount > 0 ? (
                            <p className="text-xs text-rose-300">
                              ⚠️ Impossible de supprimer. {productCount} produit(s) utilisent cette catégorie.
                            </p>
                          ) : (
                            <>
                              <p className="text-xs text-white/60">Supprimer cette catégorie ?</p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  disabled={deletingCategoryId === category.id}
                                  className="flex-1 rounded-lg bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/30 transition-colors disabled:opacity-50"
                                >
                                  {deletingCategoryId === category.id ? "..." : "Supprimer"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowCategoryOptions(null)}
                                  className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-white hover:bg-white/10 transition-colors"
                                >
                                  Annuler
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-white/10 p-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(!showNewCategory)
                    setError("")
                  }}
                  className="w-full flex items-center gap-2 rounded-lg bg-[#c9a84c]/10 px-3 py-2 text-sm text-[#c9a84c] hover:bg-[#c9a84c]/20 transition-colors"
                >
                  <Plus size={16} />
                  Créer une catégorie
                </button>
              </div>

              {showNewCategory && (
                <div className="border-t border-white/10 p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Français"
                    value={newCategoryFr}
                    onChange={(e) => setNewCategoryFr(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]/50"
                  />
                  <input
                    type="text"
                    placeholder="العربية"
                    value={newCategoryAr}
                    onChange={(e) => setNewCategoryAr(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]/50 text-right"
                    dir="rtl"
                  />
                  {error && <p className="text-xs text-rose-400">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={isCreating}
                      className="flex-1 rounded-lg bg-[#c9a84c] px-3 py-2 text-xs font-semibold text-black disabled:opacity-50 hover:bg-[#d9b85c] transition-colors"
                    >
                      {isCreating ? "..." : "Créer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false)
                        setNewCategoryFr("")
                        setNewCategoryAr("")
                        setError("")
                      }}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white hover:bg-white/10 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

