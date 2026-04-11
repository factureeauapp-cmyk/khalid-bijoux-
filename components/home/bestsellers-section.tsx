"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { products } from "@/data/products"
import { ProductCard } from "@/components/products/product-card"
import { Button } from "@/components/ui/button"

export function BestsellersSection() {
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4)

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Best <span className="gold-gradient-text">Sellers</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Our most loved pieces, chosen by customers who appreciate exceptional craftsmanship and timeless design.
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-6 md:mt-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground group"
            asChild
          >
            <Link href="/shop">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
