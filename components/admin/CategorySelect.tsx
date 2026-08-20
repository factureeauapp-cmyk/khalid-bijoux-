"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Plus, X, Trash2, AlertTriangle } from "lucide-react"
import type { Category, Product } from "@/lib/store-types"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

import { useAppContext } from "@/app/providers/AppContext"

interface CategorySelectProps {
  categories: Category[]
  products: Product[]
  selectedCategoryId: string
  onSelectCategory: (categoryId: string) => void
  onCategoryDeleted?: () => void
  language: "fr" | "ar"
  isLoading?: boolean
}

// Extrait le nombre de produits depuis le message d'erreur backend
// (ex: "Impossible de supprimer cette catégorie : 3 produit(s) utilisent cette catégorie.")
// Retourne null si aucun nombre n'est trouvé (erreur d'une autre nature).
function extractProductCountFromMessage(message: string | undefined | null): number | null {
  if (!message) return null
  const match = message.match(/(\d+)\s*produit/i)
  if (!match) return null
  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
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

  // --- Suppression de catégorie via AlertDialog ---
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  // Nombre de produits renvoyé par le BACKEND quand la suppression est refusée
  // (source de vérité, différente du count local qui peut être obsolète)
  const [blockedByProductCount, setBlockedByProductCount] = useState<number | null>(null)

  // Liste déroulante — utilisé pour faire défiler jusqu'à la catégorie
  // actuellement sélectionnée dès l'ouverture du menu.
  const listRef = useRef<HTMLDivElement>(null)

  const { t } = useAppContext()
  const admin = t("admin")
  const adminErrors = admin.errors
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  )

  useEffect(() => {
    if (!successMessage) return
    const timer = window.setTimeout(() => setSuccessMessage(""), 3200)
    return () => window.clearTimeout(timer)
  }, [successMessage])

  // Quand le menu s'ouvre (typiquement en modification de produit, la
  // catégorie déjà sélectionnée peut se trouver plus bas dans la liste),
  // on scrolle automatiquement jusqu'à l'élément sélectionné pour qu'il
  // soit visible sans que l'utilisateur ait à chercher.
  useEffect(() => {
    if (!isOpen || !listRef.current) return

    const selectedEl = listRef.current.querySelector<HTMLElement>('[data-selected="true"]')
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" })
    }
  }, [isOpen])

  const getCategoryLabel = (category: Category) => (language === "ar" ? category.nameAr : category.nameFr)

  const getProductsInCategory = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length
  }

  const handleCreateCategory = async () => {
    if (!newCategoryFr.trim() || !newCategoryAr.trim()) {
      setError(admin.bothLanguagesRequired)
      return
    }

    setError("")
    setIsCreating(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
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
      setError(err instanceof Error ? err.message : admin.categoryCreateError)
    } finally {
      setIsCreating(false)
    }
  }

  const openDeleteDialog = (category: Category) => {
    setDeleteError("")
    setBlockedByProductCount(null)
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    if (isDeletingCategory) return
    setDeleteDialogOpen(false)
    setCategoryToDelete(null)
    setDeleteError("")
    setBlockedByProductCount(null)
  }

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete || isDeletingCategory) return

    const categoryId = categoryToDelete.id
    const localProductCount = getProductsInCategory(categoryId)

    // Garde-fou côté client (rapide, évite un appel inutile la plupart du temps)
    // — mais la vérité finale reste celle du backend, gérée dans le catch ci-dessous.
    if (localProductCount > 0) {
      setBlockedByProductCount(localProductCount)
      return
    }

    setIsDeletingCategory(true)
    setDeleteError("")

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
      const response = await fetch(`${API_URL}/categories/${categoryId}`, { method: "DELETE" })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        const backendMessage: string | undefined = data.error || data.message
        const backendCount = extractProductCountFromMessage(backendMessage)

        if (backendCount !== null) {
          // Le backend a refusé car des produits utilisent encore la catégorie
          // (compte local désynchronisé ou race condition) → on bascule la modal
          // en mode "suppression impossible" avec le vrai nombre.
          setBlockedByProductCount(backendCount)
          setIsDeletingCategory(false)
          return
        }

        throw new Error(backendMessage || admin.categoryDeleteError)
      }

      // Si la catégorie supprimée était sélectionnée, sélectionner la première restante
      if (selectedCategoryId === categoryId) {
        const remaining = categories.filter((c) => c.id !== categoryId)
        if (remaining.length > 0) {
          onSelectCategory(remaining[0].id)
        }
      }

      onCategoryDeleted?.()
      setSuccessMessage(admin.categoryDeleteSuccess)
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : admin.categoryDeleteError)
    } finally {
      setIsDeletingCategory(false)
    }
  }

  // Source de vérité : si le backend (ou le check local) a signalé un blocage,
  // on l'utilise en priorité sur le count local potentiellement obsolète.
  const deleteTargetProductCount =
    blockedByProductCount ?? (categoryToDelete ? getProductsInCategory(categoryToDelete.id) : 0)
  const canDeleteTarget = blockedByProductCount === null && deleteTargetProductCount === 0

  return (
    <div className="space-y-3" dir={language === "ar" ? "rtl" : "ltr"}>
      <label className="block text-sm font-medium text-white">{admin.category}</label>

      {successMessage && (
        <div className="rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.08] px-4 py-2.5 text-sm text-[#f3d57f]">
          {successMessage}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 p-4">
          <div className="mb-3">
            <p className="font-medium text-[#e8c97e]">
              {language === "ar" ? "لا توجد فئات بعد" : "Aucune catégorie disponible"}
            </p>

            <p className="mt-1 text-xs text-white/50">
              {language === "ar"
                ? "أنشئ أول فئة لإضافة هذا المنتج."
                : "Créez votre première catégorie pour pouvoir ajouter ce produit."}
            </p>
          </div>

          {!showNewCategory ? (
            <button
              type="button"
              onClick={() => {
                setShowNewCategory(true)
                setError("")
              }}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#d9b85c] disabled:opacity-50"
            >
              <Plus size={17} />
              {admin.createCategory}
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder={admin.newCategoryFr}
                value={newCategoryFr}
                onChange={(e) => setNewCategoryFr(e.target.value)}
                disabled={isCreating}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-[#c9a84c]/50"
              />

              <input
                type="text"
                placeholder={admin.newCategoryAr}
                value={newCategoryAr}
                onChange={(e) => setNewCategoryAr(e.target.value)}
                disabled={isCreating}
                dir="rtl"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-[#c9a84c]/50"
              />

              {error && (
                <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isCreating}
                  className="flex-1 rounded-xl bg-[#c9a84c] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#d9b85c] disabled:opacity-50"
                >
                  {isCreating ? admin.creating : admin.createBtn}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false)
                    setNewCategoryFr("")
                    setNewCategoryAr("")
                    setError("")
                  }}
                  disabled={isCreating}
                  className="rounded-xl border border-white/10 px-4 py-3 text-white transition hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isLoading}
            className={`w-full rounded-2xl border bg-black/30 px-4 py-3 flex items-center justify-between text-left text-white disabled:opacity-50 transition-colors ${
              selectedCategory
                ? "border-[#c9a84c]/40 hover:border-[#c9a84c]/60"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <span className={selectedCategory ? "text-[#f3d57f]" : "text-white/50"}>
              {selectedCategory ? getCategoryLabel(selectedCategory) : admin.selectCategory}
            </span>
            <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl z-50">
              <div ref={listRef} className="max-h-60 overflow-y-auto">
                {categories.map((category) => {
                  const productCount = getProductsInCategory(category.id)
                  const isSelected = selectedCategoryId === category.id

                  return (
                    <div key={category.id} className="relative">
                      <div
                        data-selected={isSelected ? "true" : undefined}
                        className={`w-full px-4 py-3 text-left flex items-center justify-between gap-2 transition-colors ${
                          isSelected ? "bg-[#c9a84c]/20 text-[#c9a84c]" : "text-white hover:bg-white/10"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCategory(category.id)
                            setIsOpen(false)
                          }}
                          className="flex flex-1 items-center gap-2 text-left"
                        >
                          {isSelected && (
                            <Check size={15} className="shrink-0 text-[#c9a84c]" strokeWidth={2.5} />
                          )}
                          <span>
                            <div className="font-medium">{getCategoryLabel(category)}</div>
                            <div className="text-xs text-white/40 mt-1">
                              {productCount} {admin.productsCount}
                            </div>
                          </span>
                        </button>
                        {categories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => openDeleteDialog(category)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} className="text-rose-400" />
                          </button>
                        )}
                      </div>
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
                  {admin.createCategory}
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
                      {isCreating ? admin.creating : admin.createBtn}
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

      {/* Dialog de confirmation de suppression */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog()
        }}
      >
        <AlertDialogContent
          dir={language === "ar" ? "rtl" : "ltr"}
          className="max-w-sm rounded-[28px] border border-[#c9a84c]/15 bg-[#0D0D0D]/95 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          <AlertDialogHeader>
            <div
              className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border ${
                canDeleteTarget
                  ? "border-rose-500/25 bg-rose-500/10 shadow-[0_0_30px_-8px_rgba(244,63,94,0.5)]"
                  : "border-amber-500/25 bg-amber-500/10 shadow-[0_0_30px_-8px_rgba(245,158,11,0.4)]"
              }`}
            >
              <AlertTriangle
                className={`h-7 w-7 ${canDeleteTarget ? "text-rose-400" : "text-amber-400"}`}
                strokeWidth={1.75}
              />
            </div>

            <AlertDialogTitle className="text-center font-cormorant text-2xl">
              {canDeleteTarget ? admin.deleteCategoryTitle : admin.cannotDeleteCategoryTitle}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center leading-7 text-white/60">
              {canDeleteTarget ? (
                <>
                  {admin.deleteCategoryConfirmPrefix}
                  <br />
                  <span className="font-semibold text-[#E8C97E]">
                    {categoryToDelete ? getCategoryLabel(categoryToDelete) : ""}
                  </span>
                  {" ?"}
                  <br />
                  {admin.deleteCategoryIrreversible}
                </>
              ) : (
                <>
                  <span className="font-semibold text-[#E8C97E]">
                    {categoryToDelete ? getCategoryLabel(categoryToDelete) : ""}
                  </span>
                  <br />
                  <span className="mt-1 inline-block text-amber-300">
                    {admin.categoryUsedByProducts.replace("{count}", String(deleteTargetProductCount))}
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-center text-xs text-rose-400">
              {deleteError}
            </p>
          )}

          <AlertDialogFooter className="gap-2.5">
            <AlertDialogCancel
              onClick={closeDeleteDialog}
              disabled={isDeletingCategory}
              className="rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.08] disabled:opacity-50"
            >
              {canDeleteTarget ? admin.cancelBtn : admin.close}
            </AlertDialogCancel>

            {canDeleteTarget && (
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  void confirmDeleteCategory()
                }}
                disabled={isDeletingCategory}
                className="rounded-xl bg-rose-600 text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingCategory ? admin.deletingCategory : admin.delete}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}