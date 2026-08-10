"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, Pencil, Trash2, AlertTriangle, PackageX, ImageOff } from "lucide-react"
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
import type { Category, Product } from "@/lib/store-types"
import { useAppContext } from "@/app/providers/AppContext"

interface ProductListProps {
  products: Product[]
  categories: Category[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => Promise<void>
  language: "fr" | "ar"
  isDeleting: Set<string>
  onStockUpdated?: () => Promise<void>
}

const LOW_STOCK_THRESHOLD = 5

export function ProductList({
  products,
  categories,
  onEdit,
  onDelete,
  language,
  isDeleting,
  onStockUpdated,
}: ProductListProps) {
  const { t } = useAppContext()
  const adminT = t("admin")

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [stockUpdatingId, setStockUpdatingId] = useState<string | null>(null)
  const [stockMessage, setStockMessage] = useState<string | null>(null)
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return adminT.withoutCategory
    return language === "ar" ? category.nameAr : category.nameFr
  }

  const getProductName = (product: Product) => (language === "ar" ? product.nameAr : product.nameFr)

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) {
      return {
        label: adminT.outOfStockLabel,
        dot: "bg-rose-500",
        text: "text-rose-400",
        ring: "ring-rose-500/20",
      }
    }
    if (quantity <= LOW_STOCK_THRESHOLD) {
      return {
        label: adminT.lowStock,
        dot: "bg-amber-400",
        text: "text-amber-300",
        ring: "ring-amber-400/20",
      }
    }
    return {
      label: adminT.stockAvailable,
      dot: "bg-emerald-400",
      text: "text-emerald-300",
      ring: "ring-emerald-400/20",
    }
  }

  const openDeleteDialog = (product: Product) => {
    setDeleteTarget(product)
    setDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    await onDelete(deleteTarget.id)
    setDialogOpen(false)
    setDeleteTarget(null)
  }

  const changeStock = async (product: Product, delta: number) => {
    setStockUpdatingId(product.id)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${product.id}/stock/${delta > 0 ? "add" : "decrease"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: Math.abs(delta) }),
        }
      )
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || payload.message || adminT.stockUpdateError)
      }
      setStockMessage(`${adminT.stockUpdateSuccess} ${getProductName(product)}`)
      await onStockUpdated?.()
    } catch (error) {
      setStockMessage(error instanceof Error ? error.message : adminT.stockUpdateError)
    } finally {
      setStockUpdatingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-8 py-16 text-center backdrop-blur-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <PackageX className="h-6 w-6 text-white/40" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-white/50">{adminT.noProducts}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5" dir={language === "ar" ? "rtl" : "ltr"}>
      {stockMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#C9A84C]/25 bg-[#C9A84C]/[0.08] px-4 py-3 text-sm text-[#F3DD9F] shadow-[0_0_0_1px_rgba(201,168,76,0.05)] transition-all animate-in fade-in slide-in-from-top-1">
          {stockMessage}
        </div>
      )}

      {/* auto-fill : le nombre de colonnes suit la largeur RÉELLE du conteneur,
          pas le viewport — évite l'entassement quand une sidebar fixe réduit l'espace */}
      <div
        className="grid gap-4 sm:gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
      >
        {products.map((product) => {
          const quantity = product.quantity ?? 0
          const status = getStockStatus(quantity)
          const isBusy = stockUpdatingId === product.id
          const isRemoving = isDeleting.has(product.id)
          const imageFailed = brokenImages.has(product.id)

          return (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.03] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#C9A84C]/25 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                {imageFailed || !product.image ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black/50">
                    <ImageOff className="h-6 w-6 text-white/25" strokeWidth={1.5} />
                    <span className="px-2 text-center text-[11px] text-white/30">{getProductName(product)}</span>
                  </div>
                ) : (
                  <Image
                    src={product.image}
                    alt={getProductName(product) || adminT.productImageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={() => setBrokenImages((prev) => new Set(prev).add(product.id))}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                {product.tag && (
                  <span className="absolute top-3 right-3 max-w-[55%] truncate rounded-full border border-[#C9A84C]/40 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#E8C97E] backdrop-blur-sm">
                    {product.tag}
                  </span>
                )}

                <span className="absolute bottom-3 left-3 max-w-[70%] truncate rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
                  {getCategoryLabel(product.categoryId)}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
                <div>
                  <h3 className="truncate font-cormorant text-xl leading-tight text-white sm:text-2xl">
                    {getProductName(product)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/50">
                    {language === "ar" ? product.descriptionAr : product.descriptionFr}
                  </p>
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="whitespace-nowrap text-xl font-semibold tracking-tight text-[#E8C97E] sm:text-2xl">
                    {product.price} <span className="text-sm font-medium text-[#C9A84C]/70">{adminT.mad}</span>
                  </span>
                  {product.originalPrice && (
                    <span className="whitespace-nowrap text-xs text-white/30 line-through">
                      {product.originalPrice} {adminT.mad}
                    </span>
                  )}
                </div>

                {/* Stock card */}
                <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-3.5 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${status.dot} shadow-[0_0_8px_currentColor] ${status.text}`} />
                      <span className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-white/40">
                        {adminT.stockLabel}
                      </span>
                    </div>
                    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${status.text} ${status.ring}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{quantity}</div>

                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => changeStock(product, 1)}
                      disabled={isBusy}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-2.5 text-sm font-medium text-emerald-300 transition-all duration-200 hover:border-emerald-400/40 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                      <span className="truncate">{adminT.increaseStock}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => changeStock(product, -1)}
                      disabled={isBusy || quantity <= 0}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-3 py-2.5 text-sm font-medium text-amber-300 transition-all duration-200 hover:border-amber-400/40 hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                      <span className="truncate">{adminT.decreaseStock}</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2 pt-1 sm:gap-2.5">
                  <button
                    onClick={() => onEdit(product)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#C9A84C]/25 bg-[#C9A84C]/[0.08] px-2.5 py-2.5 text-sm font-medium text-[#E8C97E] transition-all duration-200 hover:border-[#C9A84C]/45 hover:bg-[#C9A84C]/15"
                  >
                    <Pencil className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                    <span className="truncate">{adminT.edit}</span>
                  </button>
                  <button
                    onClick={() => openDeleteDialog(product)}
                    disabled={isRemoving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/[0.06] px-2.5 py-2.5 text-sm font-medium text-rose-400 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                    <span className="truncate">{isRemoving ? adminT.deleting : adminT.delete}</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-sm rounded-[28px] border border-[#C9A84C]/15 bg-[#0D0D0D]/95 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/25 bg-rose-500/10 shadow-[0_0_30px_-8px_rgba(244,63,94,0.5)]">
              <AlertTriangle className="h-7 w-7 text-rose-400" strokeWidth={1.75} />
            </div>

            <AlertDialogTitle className="text-center font-cormorant text-2xl">
              {adminT.deleteProductTitle}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center leading-7 text-white/60">
              {adminT.deleteProductDescription}
              <br />
              <span className="font-semibold text-[#E8C97E]">
                {deleteTarget ? getProductName(deleteTarget) : ""}
              </span>
              {" ?"}
              <br />
              {adminT.irreversibleAction}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2.5">
            <AlertDialogCancel className="rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.08]">
              {adminT.cancelBtn}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl bg-rose-600 text-white transition-colors hover:bg-rose-700"
            >
              {adminT.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}