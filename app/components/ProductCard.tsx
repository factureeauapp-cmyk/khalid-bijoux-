"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ImageOff, Plus } from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"
import { getCategoryById, getCategoryName, getProductDescription, getProductName } from "@/lib/product-utils"
import type { Product } from "@/lib/store-types"
import { Heart } from "lucide-react"

// Seuil de glissement (px) à partir duquel un geste tactile est considéré
// comme un swipe plutôt qu'un simple tap.
const SWIPE_THRESHOLD = 40

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()
const { toggleWishlist, isInWishlist } = useStore()
  const { t, language, categories } = useAppContext()
  const shop = t("shop")
  const [mounted, setMounted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  // Carousel d'images
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set())
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

 const category = product.category
  ? product.category
  : product.categoryId
    ? getCategoryById(categories, product.categoryId)
    : null
    

  // Prevent rendering until hydration is complete
  if (!mounted) return null

  // Get language-aware product properties
  const productName = getProductName(product, language)
  const productPrice = product?.price || 0
  const productTag = product?.tag || null
  const productDescription = getProductDescription(product, language)
  const isOutOfStock = (product.quantity ?? 0) <= 0
  const isFavorite = isInWishlist(product.id) 

  const productImages: string[] =
    product.images && product.images.length > 0
      ? [...product.images]
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((image) => image.imageUrl)
          .filter(Boolean)
      : product.image
        ? [product.image]
        : ["/placeholder.svg"]

  const hasMultipleImages = productImages.length > 1
  const currentIndex = activeImageIndex >= productImages.length ? 0 : activeImageIndex
  const allImagesFailed = productImages.every((_, idx) => brokenImages.has(idx))

  const discountPercent =
    product.originalPrice && product.originalPrice > productPrice
      ? Math.round(100 - (productPrice / product.originalPrice) * 100)
      : 0

  const changeImage = (direction: "next" | "prev") => {
    if (!hasMultipleImages) return

    setActiveImageIndex((prev) => {
      const current = prev >= productImages.length ? 0 : prev

      if (direction === "next") {
        return current === productImages.length - 1 ? 0 : current + 1
      }

      return current === 0 ? productImages.length - 1 : current - 1
    })
  }

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null

    if (!start || !hasMultipleImages) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return
    }

    changeImage(deltaX < 0 ? "next" : "prev")
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart(product)
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#C9A84C]/15 bg-[#141414] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#C9A84C]/45 hover:shadow-[0_12px_40px_rgba(201,168,76,0.15)]"
    >
      {/* ================================================= */}
      {/* IMAGE CAROUSEL — sliding track                    */}
      {/* ================================================= */}

      <div
        className="relative block aspect-square w-full touch-pan-y select-none overflow-hidden bg-[#0A0A0A]"
        dir="ltr"
        onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
        onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
      >


 {/* Wishlist */}
<button
  type="button"
  onClick={(event) => {
    event.stopPropagation()
    toggleWishlist(product)
  }}
  aria-label={
    isFavorite
      ? language === "ar"
        ? "إزالة من المفضلة"
        : "Retirer des favoris"
      : language === "ar"
        ? "إضافة إلى المفضلة"
        : "Ajouter aux favoris"
  }
  title={
    isFavorite
      ? language === "ar"
        ? "إزالة من المفضلة"
        : "Retirer des favoris"
      : language === "ar"
        ? "إضافة إلى المفضلة"
        : "Ajouter aux favoris"
  }
  className="
    absolute right-4 top-4 z-40
    flex h-10 w-10 items-center justify-center
    rounded-full
    border border-white/20
    bg-black/50
    text-white
    backdrop-blur-md
    transition-all duration-300
    hover:scale-110
    hover:border-[#C9A84C]/60
    hover:bg-black/75
    active:scale-95
  "
>
  <Heart
    className={`h-5 w-5 transition-all duration-300 ${
      isFavorite
        ? "fill-[#E8C97E] text-[#E8C97E]"
        : "text-white"
    }`}
    strokeWidth={1.8}
  />
</button>
       
        {allImagesFailed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black/50">
            <ImageOff className="h-6 w-6 text-white/25" strokeWidth={1.5} />
            <span className="px-2 text-center text-[11px] text-white/30">{productName}</span>
          </div>
        ) : (
          <div
            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {productImages.map((imageUrl, index) => {
              const failed = brokenImages.has(index)

              return (
                <div key={`${imageUrl}-${index}`} className="relative h-full w-full shrink-0">
                  {failed ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-black/50">
                      <ImageOff className="h-6 w-6 text-white/25" strokeWidth={1.5} />
                    </div>
                  ) : (
                    <Image
                      src={imageUrl}
                      alt={`${productName || "product image"} - ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      priority={index === 0}
                      onError={() => {
                        setBrokenImages((prev) => {
                          const next = new Set(prev)
                          next.add(index)
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

        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute left-4 top-4 z-20">
            <span className="rounded-full border border-rose-400/40 bg-rose-500/90 px-3 py-1 text-[10px] font-bold tracking-wide text-white shadow-lg">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Product tag */}
        {productTag && (
          <div
            className={`absolute z-20 ${discountPercent > 0 ? "left-4 top-11" : "left-4 top-4"}`}
          >
            <span className="rounded-md bg-linear-to-r from-[#C9A84C] to-[#E8C97E] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0D0D0D] shadow-lg">
              {productTag}
            </span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute right-4 top-4 z-20 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-rose-300 backdrop-blur-sm">
            {language === "ar" ? "نفد" : "Rupture"}
          </div>
        )}

        {/* Hover Overlay with "+" button */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="pointer-events-auto rounded-full bg-linear-to-r from-[#C9A84C] to-[#E8C97E] p-3 text-[#0D0D0D] shadow-xl transition-transform duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Add to cart"
            title={language === "ar" ? "أضف إلى السلة" : "Ajouter au panier"}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* ============================================= */}
        {/* IMAGE CONTROLS                                 */}
        {/* ============================================= */}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                changeImage("prev")
              }}
              aria-label="Image précédente"
              className="absolute left-2 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:border-[#C9A84C]/50 hover:bg-black/75 hover:text-[#E8C97E] active:scale-90 group-hover:opacity-100 sm:h-9 sm:w-9 max-sm:opacity-90"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                changeImage("next")
              }}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:border-[#C9A84C]/50 hover:bg-black/75 hover:text-[#E8C97E] active:scale-90 group-hover:opacity-100 sm:h-9 sm:w-9 max-sm:opacity-90"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 left-3 z-20 rounded-full border border-white/15 bg-black/55 px-2.5 py-0.5 text-[10px] font-medium tabular-nums text-white/85 backdrop-blur-md">
              {currentIndex + 1} / {productImages.length}
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-md">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setActiveImageIndex(index)
                  }}
                  aria-label={`Afficher l'image ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-4 bg-[#E8C97E]" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          <p className="inline-flex max-w-full truncate rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/10 px-3 py-1 text-[11px] font-medium tracking-wider text-[#f3dd9f]">
            {category ? getCategoryName(category, language) : language === "ar" ? "غير مصنف" : "Sans categorie"}
          </p>

          {/* Nom du produit : 2 lignes max, hauteur uniforme entre les cartes */}
          <h3 className="line-clamp-2 min-h-[52px] break-words font-cormorant text-[20px] font-semibold leading-[26px] text-white">
            {productName || "Product"}
          </h3>

          {/* Description : 3 lignes max, hauteur fixe, jamais de débordement */}
          <p className="h-[72px] overflow-hidden break-words text-sm leading-6 text-[#c9c2b7] line-clamp-3">
            {productDescription}
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-end justify-between gap-3 border-t border-white/[0.06] pt-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="truncate text-[18px] font-bold text-[#E8C97E]">{productPrice} MAD</p>
                {product?.originalPrice && (
                  <p className="truncate text-[12px] font-medium text-[#A0A0A0] line-through">
                    {product.originalPrice} MAD
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 pt-4 sm:gap-2.5">
            {/* Détails */}
            <button
              type="button"
              onClick={() => router.push(`/product/${product.id}`)}
              className="
                flex h-[48px] min-w-0 items-center justify-center
                overflow-hidden rounded-[14px] border border-[#C9A84C]
                bg-transparent px-1.5
                text-[10.5px] font-semibold uppercase tracking-[0.02em]
                text-[#C9A84C] whitespace-nowrap
                transition-all duration-300
                hover:border-[#E8C97E] hover:bg-[#C9A84C]/10 hover:text-[#E8C97E]
                active:scale-[0.98]
                sm:h-[52px] sm:px-3 sm:text-xs sm:tracking-[0.06em]
              "
              aria-label={language === "ar" ? "عرض تفاصيل المنتج" : "Voir les détails du produit"}
              title={shop.details}
            >
              <span className="truncate">{shop.details}</span>
            </button>

            {/* Commander */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="
                flex h-[48px] min-w-0 items-center justify-center gap-1
                overflow-hidden rounded-[14px]
                bg-linear-to-r from-[#C9A84C] via-[#E8C97E] to-[#C9A84C]
                px-1.5
                text-[10.5px] font-semibold uppercase tracking-[0.02em]
                text-[#0D0D0D] whitespace-nowrap
                shadow-[0_10px_24px_rgba(201,168,76,0.18)]
                transition-all duration-300
                hover:shadow-[0_14px_32px_rgba(201,168,76,0.28)]
                active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-50
                sm:h-[52px] sm:px-3 sm:text-xs sm:tracking-[0.05em]
              "
              aria-label={language === "ar" ? "طلب المنتج" : "Commander le produit"}
              title={shop.order}
            >
              <Plus size={13} className="shrink-0" />
              <span className="truncate">{shop.order}</span>
            </button>
          </div>

          {/* Feedback message */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 rounded-lg border border-green-500/50 bg-green-500/20 px-3 py-2 text-center text-xs text-green-300"
            >
              {language === "ar" ? "✓ تمت الإضافة" : "✓ Ajouté au panier"}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}