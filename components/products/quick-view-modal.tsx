"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function QuickViewModal() {
  const {
    isQuickViewOpen,
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore()

  const [selectedSize, setSelectedSize] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!quickViewProduct) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: siteConfig.currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    const size = selectedSize || quickViewProduct.sizes[0]
    addToCart(quickViewProduct, quantity, size)
    closeQuickView()
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === quickViewProduct.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? quickViewProduct.images.length - 1 : prev - 1
    )
  }

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-card rounded-2xl z-50 overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full text-foreground hover:bg-background transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-secondary">
              <Image
                src={quickViewProduct.images[currentImageIndex]}
                alt={quickViewProduct.name}
                fill
                className="object-cover"
              />

              {/* Image Navigation */}
              {quickViewProduct.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {quickViewProduct.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === currentImageIndex ? "bg-primary" : "bg-foreground/30"
                    )}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <p className="text-primary text-sm uppercase tracking-wider mb-2">
                    {quickViewProduct.category}
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                    {quickViewProduct.name}
                  </h2>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-3xl gold-gradient-text">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  <span className="text-muted-foreground">
                    {quickViewProduct.karat} | {quickViewProduct.weight}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Size Selection */}
                <div>
                  <label className="text-sm text-foreground mb-3 block">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 border rounded-lg text-sm transition-all",
                          selectedSize === size || (!selectedSize && size === quickViewProduct.sizes[0])
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm text-foreground mb-3 block">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 gold-gradient text-primary-foreground hover:opacity-90"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toggleWishlist(quickViewProduct)}
                    className={cn(
                      "border-primary",
                      isInWishlist(quickViewProduct.id)
                        ? "bg-primary text-primary-foreground"
                        : "text-primary hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        isInWishlist(quickViewProduct.id) && "fill-current"
                      )}
                    />
                  </Button>
                </div>

                <Link
                  href={`/product/${quickViewProduct.id}`}
                  onClick={closeQuickView}
                  className="block text-center text-primary hover:underline text-sm"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
