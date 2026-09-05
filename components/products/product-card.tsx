"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, ShoppingBag } from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { siteConfig } from "@/lib/config"
import type { Product } from "@/lib/store-types"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({
  product,
  index = 0,
}: ProductCardProps) {
  const {
    toggleWishlist,
    isInWishlist,
    openQuickView,
    addToCart,
  } = useStore()

  const [isHovered, setIsHovered] = useState(false)

  /*
   * =====================================================
   * IMAGE SÉCURISÉE
   * =====================================================
   */

  const imageSrc =
    Array.isArray(product.images)
      ? product.images.find(
          (image) =>
            typeof image === "string" &&
            image.trim().length > 0
        )
      : undefined

  const safeImageSrc = imageSrc || "/placeholder.svg"

  /*
   * =====================================================
   * WISHLIST
   * =====================================================
   */

  const isFavorite = isInWishlist(product.id)

  /*
   * =====================================================
   * PRICE
   * =====================================================
   */

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: siteConfig.currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  /*
   * =====================================================
   * ADD TO CART
   * =====================================================
   */

  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    const firstSize = product.sizes?.[0] || ""

    addToCart(product, 1, firstSize)
  }

  /*
   * =====================================================
   * WISHLIST
   * =====================================================
   */

  const handleToggleWishlist = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    toggleWishlist(product)
  }

  /*
   * =====================================================
   * QUICK VIEW
   * =====================================================
   */

  const handleQuickView = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    openQuickView(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-500",
          "gold-border-hover",
          isHovered && "gold-glow"
        )}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(2deg) rotateY(${
                Math.random() > 0.5 ? 2 : -2
              }deg)`
            : "none",
          transition: "transform 0.3s ease",
        }}
      >
        {/* =====================================================
            IMAGE
        ===================================================== */}

        <div className="relative aspect-square overflow-hidden">

          <Link
            href={`/product/${product.id}`}
            className="block h-full w-full"
          >
            <Image
              src={safeImageSrc}
              alt={product.name || "Produit"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Shine Effect */}
            <div
              className="
                absolute inset-0
                shine-effect
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
            />

            {/* =================================================
                BADGES
            ================================================= */}

            <div className="absolute top-3 left-3 flex flex-col gap-2">

              {product.featured && (
                <span
                  className="
                    rounded-full
                    gold-gradient
                    px-3 py-1
                    text-xs
                    font-medium
                    text-primary-foreground
                  "
                >
                  Featured
                </span>
              )}

              {product.bestseller && (
                <span
                  className="
                    rounded-full
                    bg-foreground
                    px-3 py-1
                    text-xs
                    font-medium
                    text-background
                  "
                >
                  Bestseller
                </span>
              )}

            </div>
          </Link>

          {/* =====================================================
              WISHLIST
          ===================================================== */}

          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleToggleWishlist}
            className={cn(
              "absolute right-3 top-3 z-30",
              "flex h-10 w-10 items-center justify-center",
              "rounded-full border",
              "bg-background/90 backdrop-blur-sm",
              "shadow-lg",
              "transition-all duration-300",
              "hover:border-primary"
            )}
            aria-label={
              isFavorite
                ? "Retirer des favoris"
                : "Ajouter aux favoris"
            }
            title={
              isFavorite
                ? "Retirer des favoris"
                : "Ajouter aux favoris"
            }
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-foreground hover:text-red-500"
              )}
              strokeWidth={1.8}
            />
          </motion.button>

          {/* =====================================================
              QUICK ACTIONS
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="
              absolute
              bottom-3
              left-3
              right-3
              z-20
              flex
              items-center
              justify-center
              gap-2
            "
          >

            {/* Quick View */}

            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickView}
              className="
                rounded-full
                bg-background/90
                p-3
                text-foreground
                backdrop-blur-sm
                transition-colors
                hover:text-primary
              "
              aria-label="Aperçu rapide"
            >
              <Eye className="h-4 w-4" />
            </motion.button>

            {/* Add To Cart */}

            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="
                rounded-full
                gold-gradient
                p-3
                text-primary-foreground
              "
              aria-label="Ajouter au panier"
            >
              <ShoppingBag className="h-4 w-4" />
            </motion.button>

          </motion.div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="p-4">

          {/* <p
            className="
              mb-1
              text-xs
              uppercase
              tracking-wider
              text-primary
            "
          >
            {product.category || "Sans catégorie"}
          </p> */}

          <p className="text-xs text-primary uppercase tracking-wider mb-1">
  {typeof product.category === "object" && product.category !== null
    ? product.category.nameFr || product.category.nameAr || "Sans catégorie"
    : product.category || "Sans catégorie"}
</p>

          <Link href={`/product/${product.id}`}>
            <h3
              className="
                font-serif
                text-foreground
                transition-colors
                line-clamp-1
                group-hover:text-primary
              "
            >
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-baseline gap-2">

            <span className="font-serif text-lg gold-gradient-text">
              {formatPrice(product.price)}
            </span>

            <span className="text-xs text-muted-foreground">
              {product.karat}
            </span>

          </div>
        </div>
      </div>
    </motion.div>
  )
}