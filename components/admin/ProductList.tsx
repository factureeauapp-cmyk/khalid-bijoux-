"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import {
  Plus,
  Minus,
  Pencil,
  Trash2,
  AlertTriangle,
  PackageX,
  ImageOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

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
import { getCategoryById, getCategoryName } from "@/lib/product-utils"

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
// Minimum horizontal drag (px) before a touch gesture counts as a swipe.
const SWIPE_THRESHOLD = 40

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

  // Image active pour chaque produit
  const [activeImageIndexes, setActiveImageIndexes] = useState<
    Record<string, number>
  >({})

  // Images qui ont échoué
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())

  // Position tactile de départ, pour détecter un swipe horizontal
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)

    if (!category) {
      return adminT.withoutCategory
    }

    return language === "ar" ? category.nameAr : category.nameFr
  }

  const getProductName = (product: Product) =>
    language === "ar" ? product.nameAr : product.nameFr

  /**
   * Retourne toutes les images du produit.
   *
   * Priorité :
   * 1. product.images
   * 2. product.image
   */
  const getProductImages = (product: Product): string[] => {
    if (product.images && product.images.length > 0) {
      return [...product.images]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((image) => image.imageUrl)
        .filter(Boolean)
    }

    if (product.image) {
      return [product.image]
    }

    return []
  }

  const getCurrentImageIndex = (product: Product, imageCount: number) => {
    const index = activeImageIndexes[product.id] ?? 0

    if (index >= imageCount) {
      return 0
    }

    return index
  }

  const changeImage = (
    product: Product,
    direction: "next" | "prev",
    imageCount: number
  ) => {
    if (imageCount <= 1) return

    const currentIndex = getCurrentImageIndex(product, imageCount)

    let nextIndex: number

    if (direction === "next") {
      nextIndex = currentIndex === imageCount - 1 ? 0 : currentIndex + 1
    } else {
      nextIndex = currentIndex === 0 ? imageCount - 1 : currentIndex - 1
    }

    setActiveImageIndexes((previous) => ({
      ...previous,
      [product.id]: nextIndex,
    }))
  }

  const selectImage = (product: Product, index: number) => {
    setActiveImageIndexes((previous) => ({
      ...previous,
      [product.id]: index,
    }))
  }

  // ---- Swipe tactile (mobile) --------------------------------------

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (
    event: React.TouchEvent,
    product: Product,
    imageCount: number
  ) => {
    const start = touchStart.current
    touchStart.current = null

    if (!start || imageCount <= 1) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    // Ignore les gestes trop courts ou majoritairement verticaux
    // (scroll de page).
    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) < Math.abs(deltaY)
    ) {
      return
    }

    changeImage(product, deltaX < 0 ? "next" : "prev", imageCount)
  }

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) {
      return {
        label: adminT.outOfStockLabel,
        dot: "bg-rose-500",
        text: "text-rose-400",
        ring: "ring-rose-500/20",
        bg: "bg-rose-500/10",
      }
    }

    if (quantity <= LOW_STOCK_THRESHOLD) {
      return {
        label: adminT.lowStock,
        dot: "bg-amber-400",
        text: "text-amber-300",
        ring: "ring-amber-400/20",
        bg: "bg-amber-400/10",
      }
    }

    return {
      label: adminT.stockAvailable,
      dot: "bg-emerald-400",
      text: "text-emerald-300",
      ring: "ring-emerald-400/20",
      bg: "bg-emerald-400/10",
    }
  }

  const getDiscountPercent = (product: Product) => {
    if (!product.originalPrice || product.originalPrice <= product.price) {
      return 0
    }

    return Math.round(100 - (product.price / product.originalPrice) * 100)
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/${product.id}/stock/${
          delta > 0 ? "add" : "decrease"
        }`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: Math.abs(delta),
          }),
        }
      )

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          payload.error || payload.message || adminT.stockUpdateError
        )
      }

      setStockMessage(`${adminT.stockUpdateSuccess} ${getProductName(product)}`)

      await onStockUpdated?.()
    } catch (error) {
      setStockMessage(
        error instanceof Error ? error.message : adminT.stockUpdateError
      )
    } finally {
      setStockUpdatingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-6 py-14 text-center backdrop-blur-sm sm:px-8 sm:py-16">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <PackageX className="h-6 w-6 text-white/40" strokeWidth={1.5} />
        </div>

        <p className="text-sm text-white/50">{adminT.noProducts}</p>
      </div>
    )
  }

  return (
    <div className="space-y-5" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Stock message */}
      {stockMessage && (
        <div className="flex items-start gap-2 rounded-2xl border border-[#C9A84C]/25 bg-[#C9A84C]/[0.08] px-4 py-3 text-sm text-[#F3DD9F] shadow-[0_0_0_1px_rgba(201,168,76,0.05)] transition-all animate-in fade-in slide-in-from-top-1">
          {stockMessage}
        </div>
      )}

      {/* Products */}
      <div
        className="grid gap-3.5 xs:gap-4 sm:gap-5"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {products.map((product) => {
          const quantity = product.quantity ?? 0
          const status = getStockStatus(quantity)
          const discountPercent = getDiscountPercent(product)

          const isBusy = stockUpdatingId === product.id
          const isRemoving = isDeleting.has(product.id)

          const productImages = getProductImages(product)
          const hasMultipleImages = productImages.length > 1

          const category = product.category
            ? product.category
            : product.categoryId
              ? getCategoryById(categories, product.categoryId)
              : null
              

          const currentImageIndex = getCurrentImageIndex(
            product,
            productImages.length
          )

          const allImagesFailed =
            productImages.length === 0 ||
            productImages.every((_, idx) =>
              brokenImages.has(`${product.id}-${idx}`)
            )

          return (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.03] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#C9A84C]/35 hover:bg-white/[0.05] hover:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.65)] sm:rounded-[22px]"
            >
              {/* ================================================= */}
              {/* IMAGE CAROUSEL — sliding track                    */}
              {/* ================================================= */}

              <div
                className="relative aspect-square w-full touch-pan-y select-none overflow-hidden bg-gradient-to-b from-neutral-800/60 to-black/60"
                dir="ltr"
                onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
                onTouchEnd={
                  hasMultipleImages
                    ? (event) =>
                        handleTouchEnd(event, product, productImages.length)
                    : undefined
                }
              >
                {allImagesFailed ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black/50">
                    <ImageOff className="h-6 w-6 text-white/25" strokeWidth={1.5} />
                    <span className="px-2 text-center text-[11px] text-white/30">
                      {getProductName(product)}
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {productImages.map((imageUrl, index) => {
                      const imageKey = `${product.id}-${index}`
                      const failed = brokenImages.has(imageKey)

                      return (
                        <div
                          key={imageKey}
                          className="relative h-full w-full shrink-0"
                        >
                          {failed ? (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black/50">
                              <ImageOff
                                className="h-6 w-6 text-white/25"
                                strokeWidth={1.5}
                              />
                            </div>
                          ) : (
                            <Image
                              src={imageUrl}
                              alt={`${getProductName(product)} - image ${index + 1}`}
                              fill
                              draggable={false}
                              priority={index === 0}
                              sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                              onError={() => {
                                setBrokenImages((previous) => {
                                  const next = new Set(previous)
                                  next.add(imageKey)
                                  return next
                                })
                              }}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Vignette + gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/5 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.35)]" />

                {/* Discount badge */}
                {discountPercent > 0 && (
                  <span className="absolute left-2.5 top-2.5 z-10 rounded-full border border-rose-400/40 bg-rose-500/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm sm:left-3 sm:top-3">
                    -{discountPercent}%
                  </span>
                )}

                {/* Tag */}
                {product.tag && (
                  <span className="absolute right-2.5 top-2.5 z-10 max-w-[55%] truncate rounded-full border border-[#C9A84C]/40 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#E8C97E] backdrop-blur-sm sm:right-3 sm:top-3">
                    {product.tag}
                  </span>
                )}

                {/* ============================================= */}
                {/* IMAGE CONTROLS                                 */}
                {/* ============================================= */}

                {hasMultipleImages && (
                  <>
                    {/* Previous */}
                    <button
                      type="button"
                      onClick={() => changeImage(product, "prev", productImages.length)}
                      aria-label="Image précédente"
                      className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:border-[#C9A84C]/50 hover:bg-black/75 hover:text-[#E8C97E] active:scale-90 group-hover:opacity-100 sm:h-9 sm:w-9 max-sm:opacity-90"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    {/* Next */}
                    <button
                      type="button"
                      onClick={() => changeImage(product, "next", productImages.length)}
                      aria-label="Image suivante"
                      className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:border-[#C9A84C]/50 hover:bg-black/75 hover:text-[#E8C97E] active:scale-90 group-hover:opacity-100 sm:h-9 sm:w-9 max-sm:opacity-90"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    {/* Counter */}
                    <div className="absolute bottom-2.5 left-2.5 z-20 rounded-full border border-white/15 bg-black/55 px-2.5 py-0.5 text-[10px] font-medium tabular-nums text-white/85 backdrop-blur-md sm:bottom-3 sm:left-3">
                      {currentImageIndex + 1} / {productImages.length}
                    </div>

                    {/* Dots */}
                    <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-md sm:bottom-3 sm:right-3">
                      {productImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectImage(product, index)}
                          aria-label={`Afficher l'image ${index + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "w-4 bg-[#E8C97E]"
                              : "w-1.5 bg-white/40 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ================================================= */}
              {/* BODY                                               */}
              {/* ================================================= */}

              <div className="flex flex-1 flex-col gap-3 p-3.5 sm:gap-3.5 sm:p-5">
                <div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#C9A84C]/60">
                     {category ? getCategoryName(category, language) : language === "ar" ? "غير مصنف" : "Sans categorie"}
                  </span>

                  <h3 className="mt-0.5 truncate font-cormorant text-lg leading-tight text-white sm:text-2xl">
                    {getProductName(product)}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/45 sm:text-sm">
                    {language === "ar" ? product.descriptionAr : product.descriptionFr}
                  </p>
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-white/[0.06] pt-3">
                  <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-[#E8C97E] sm:text-2xl">
                    {product.price}{" "}
                    <span className="text-xs font-medium text-[#C9A84C]/70 sm:text-sm">
                      {adminT.mad}
                    </span>
                  </span>

                  {product.originalPrice && (
                    <span className="whitespace-nowrap text-xs text-white/30 line-through">
                      {product.originalPrice} {adminT.mad}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${status.dot} shadow-[0_0_8px_currentColor] ${status.text}`}
                      />
                      <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-wide text-white/40 sm:text-xs">
                        {adminT.stockLabel}
                      </span>
                    </div>

                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 sm:text-[11px] ${status.text} ${status.ring} ${status.bg}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-2 text-xl font-semibold text-white sm:text-3xl">
                    {quantity}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => changeStock(product, 1)}
                      disabled={isBusy}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-2 py-2.5 text-xs font-medium text-emerald-300 transition-all duration-200 hover:border-emerald-400/40 hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                    >
                      <Plus className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                      <span className="truncate">{adminT.increaseStock}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => changeStock(product, -1)}
                      disabled={isBusy || quantity <= 0}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-2 py-2.5 text-xs font-medium text-amber-300 transition-all duration-200 hover:border-amber-400/40 hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                    >
                      <Minus className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                      <span className="truncate">{adminT.decreaseStock}</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2 pt-1 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#C9A84C]/25 bg-[#C9A84C]/[0.08] px-2.5 py-2.5 text-xs font-medium text-[#E8C97E] transition-all duration-200 hover:border-[#C9A84C]/45 hover:bg-[#C9A84C]/15 sm:text-sm"
                  >
                    <Pencil className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                    <span className="truncate">{adminT.edit}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openDeleteDialog(product)}
                    disabled={isRemoving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/[0.06] px-2.5 py-2.5 text-xs font-medium text-rose-400 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                    <span className="truncate">
                      {isRemoving ? adminT.deleting : adminT.delete}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ========================================================= */}
      {/* DELETE DIALOG                                             */}
      {/* ========================================================= */}

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