"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"
import { getCategoryById, getCategoryName, getProductDescription, getProductName } from "@/lib/product-utils"
import type { Product } from "@/lib/store-types"

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { t, language, categories } = useAppContext()
  const shop = t("shop")
  const [mounted, setMounted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

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
  const productImage = product?.image || "/placeholder.svg"
  const productPrice = product?.price || 0
  const productTag = product?.tag || null
  const productDescription = getProductDescription(product, language)
  const isOutOfStock = (product.quantity ?? 0) <= 0

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
      {productTag && (
        <div className="absolute left-4 top-4 z-20">
          <span className="rounded-md bg-linear-to-r from-[#C9A84C] to-[#E8C97E] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0D0D0D] shadow-lg">
            {productTag}
          </span>
        </div>
      )}

      {isOutOfStock && (
        <div className="absolute right-4 top-4 z-20 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-rose-300">
          {language === "ar" ? "نفد" : "Rupture"}
        </div>
      )}

      <div className="relative block h-70 w-full overflow-hidden bg-[#0A0A0A]">
        <Image
          src={productImage}
          alt={productName || "product image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          priority={false}
        />

        {/* Hover Overlay with "+" button - positioned above content */}
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
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[18px] font-bold text-[#E8C97E]">{productPrice} MAD</p>
              {product?.originalPrice && (
                <p className="truncate text-[12px] font-medium text-[#A0A0A0] line-through">
                  {product.originalPrice} MAD
                </p>
              )}
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