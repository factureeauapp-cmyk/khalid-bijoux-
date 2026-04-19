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

  // Get category information
  const category = product?.categoryId ? getCategoryById(categories, product.categoryId) : null

  // Prevent rendering until hydration is complete
  if (!mounted) return null

  // Get language-aware product properties
  const productName = getProductName(product, language)
  const productImage = product?.image || "/placeholder.svg"
  const productPrice = product?.price || 0
  const productTag = product?.tag || null
  const productDescription = getProductDescription(product, language)

  const handleAddToCart = () => {
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
          <span className="rounded-md bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0D0D0D] shadow-lg">
            {productTag}
          </span>
        </div>
      )}

      <div className="relative block h-[280px] w-full overflow-hidden bg-[#0A0A0A]">
        <Image
          src={productImage}
          alt={productName || "product image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          priority={false}
        />
      </div>

      {/* Hover Overlay with "+" button - positioned above content */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={handleAddToCart}
          className="rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E8C97E] p-3 text-[#0D0D0D] shadow-xl transition-transform duration-300 hover:scale-110"
          aria-label="Add to cart"
          title={language === "ar" ? "أضف إلى السلة" : "Ajouter au panier"}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-2">
          <p className="inline-flex rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/10 px-3 py-1 text-[11px] font-medium tracking-wider text-[#f3dd9f]">
            {category ? getCategoryName(category, language) : language === "ar" ? "غير مصنف" : "Sans categorie"}
          </p>
          <h3 className="text-[20px] font-cormorant font-semibold leading-tight text-white">
            {productName || "Product"}
          </h3>
          <p className="line-clamp-2 text-sm text-[#c9c2b7]">{productDescription}</p>
        </div>
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[18px] font-bold text-[#E8C97E]">{productPrice} MAD</p>
              {product?.originalPrice && (
                <p className="text-[12px] font-medium text-[#A0A0A0] line-through">
                  {product.originalPrice} MAD
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/product/${product?.id}`)}
              className="btn-secondary flex-1 text-center"
              aria-label="View product details"
            >
              {shop.details}
            </button>
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1"
              aria-label="Order now"
            >
              {shop.order}
            </button>
          </div>

          {/* Feedback message */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 rounded-lg bg-green-500/20 border border-green-500/50 px-3 py-2 text-center text-xs text-green-300"
            >
              {language === "ar" ? "✓ تمت الإضافة" : "✓ Ajouté au panier"}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
