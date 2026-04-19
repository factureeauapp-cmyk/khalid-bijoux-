"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, ShoppingBag } from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { siteConfig } from "@/lib/config"
import type { Product } from "@/data/products"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, openQuickView, addToCart } = useStore()
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: siteConfig.currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
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
            ? `perspective(1000px) rotateX(2deg) rotateY(${Math.random() > 0.5 ? 2 : -2}deg)`
            : "none",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Image */}
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name || "Produit"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Shine Effect */}
            <div className="absolute inset-0 shine-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.featured && (
                <span className="px-3 py-1 text-xs font-medium gold-gradient text-primary-foreground rounded-full">
                  Featured
                </span>
              )}
              {product.bestseller && (
                <span className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                  Bestseller
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault()
                  openQuickView(product)
                }}
                className="p-3 bg-background/90 backdrop-blur-sm rounded-full text-foreground hover:text-primary transition-colors"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault()
                  addToCart(product, 1, product.sizes[0])
                }}
                className="p-3 gold-gradient rounded-full text-primary-foreground"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault()
                  toggleWishlist(product)
                }}
                className={cn(
                  "p-3 bg-background/90 backdrop-blur-sm rounded-full transition-colors",
                  isInWishlist(product.id)
                    ? "text-red-500"
                    : "text-foreground hover:text-red-500"
                )}
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn("w-4 h-4", isInWishlist(product.id) && "fill-current")}
                />
              </motion.button>
            </motion.div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-primary uppercase tracking-wider mb-1">
            {product.category || "Sans catégorie"}
          </p>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-serif text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-serif text-lg gold-gradient-text">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">{product.karat}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
