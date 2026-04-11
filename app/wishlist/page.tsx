"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
  const { wishlist } = useStore()

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            My <span className="gold-gradient-text">Wishlist</span>
          </h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <Heart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="font-serif text-2xl text-foreground mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Start adding items you love to your wishlist
            </p>
            <Button
              className="gold-gradient text-primary-foreground hover:opacity-90"
              asChild
            >
              <Link href="/shop">Explore Collection</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item, index) => (
              <ProductCard key={item.product.id} product={item.product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
