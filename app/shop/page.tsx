"use client"

import React, { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import { useAppContext } from "../providers/AppContext"
import { getCategoryName } from "@/lib/product-utils"
import CustomSelect from "../components/CustomSelect"

export default function ShopPage() {
  const { t, products, categories, language } = useAppContext()
  const shop = t("shop")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [maxPrice, setMaxPrice] = useState(10000)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update document direction for RTL support
  useEffect(() => {
    document.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Get product name in current language
      const productName = (language === "ar" ? product.nameAr : product.nameFr || "").toLowerCase().trim()
      const searchTerm = (searchQuery || "").toLowerCase().trim()

      // Filter by category ID
      const matchesCategory = selectedCategoryId === null || product.categoryId === selectedCategoryId

      // Filter by search term
      const matchesSearch = productName.includes(searchTerm)

      // Filter by price
      const matchesPrice = (product.price || 0) <= maxPrice

      return matchesCategory && matchesSearch && matchesPrice
    })
  }, [products, language, maxPrice, searchQuery, selectedCategoryId])


  const categoryOptions = [
  {
    value: "",
    label: shop.all,
  },

  ...categories.map((category) => ({
    value: category.id,
    label: getCategoryName(category, language),
  })),
]

  // Prevent rendering until hydration is complete
  if (!mounted) return null

  return (
    <main className="min-h-screen bg-black pt-28">
      <Navbar />
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#c9a84c]">Khalid Bijoux</p>
            <h1 className="text-4xl font-cormorant text-white md:text-6xl">{shop.title}</h1>
            <p className="max-w-2xl text-[#d1c7b7]">{shop.subtitle}</p>
          </div>

          <div className="mb-10 grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur md:grid-cols-[1.2fr_1fr_1fr]   relative z-50 w-full">
            <input
              type="text"
              placeholder={shop.search}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
            {/* <select
              value={selectedCategoryId || ""}
              onChange={(event) => setSelectedCategoryId(event.target.value || null)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            >
              <option value="">{shop.all}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryName(category, language)}
                </option>
              ))}
            </select> */}

            <CustomSelect
              value={selectedCategoryId ?? ""}
              options={categoryOptions}
              placeholder={shop.all}
              onChange={(value) => setSelectedCategoryId(value || null)}
            />

            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>{shop.price}</span>
                <span>{maxPrice} MAD</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full accent-[#c9a84c]"
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-10 text-center">
              <p className="mb-4 text-lg text-white">{shop.noResults}</p>
              <button
                onClick={() => {
                  setSelectedCategoryId(null)
                  setSearchQuery("")
                  setMaxPrice(10000)
                }}
                className="btn-secondary"
              >
                {shop.reset}
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
