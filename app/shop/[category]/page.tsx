"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"
import { useAppContext } from "../../providers/AppContext"
import type { Product } from "@/lib/store-types"

export default function CategoryPage() {
  const params = useParams()
  const categoryName = decodeURIComponent(params.category as string).toLowerCase()
  const { products, language, categories } = useAppContext()
  // Use products from AppContext (backend), or empty array if none
  const catalog: Product[] = products.length ? products : []
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update document direction for RTL support
  useEffect(() => {
    document.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  // Validate category parameter
  if (!categoryName || categoryName.trim() === "") {
    return (
      <main className="min-h-screen bg-black pt-28">
        <Navbar />
        <section className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-white/70">
              Catégorie invalide.
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  // Find categoryId matching the URL parameter
  const matchingCategory = categories.find(
    (cat) => cat.nameFr.toLowerCase() === categoryName || cat.nameAr.toLowerCase() === categoryName
  )

  const filteredProducts = useMemo(() => {
    if (!matchingCategory) return []
    return catalog.filter((product) => product.categoryId === matchingCategory.id)
  }, [catalog, matchingCategory])

  const displayTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)

  // Prevent rendering until hydration is complete
  if (!mounted) return null

  return (
    <main className="min-h-screen bg-black pt-28">
      <Navbar />
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#c9a84c]">Khalid Bijoux</p>
            <h1 className="mt-4 text-4xl font-cormorant text-white md:text-6xl">{displayTitle}</h1>
          </div>
          {filteredProducts.length ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-white/70">
              Aucune pièce disponible dans cette catégorie pour le moment.
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
