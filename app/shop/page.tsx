"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Search, SearchX } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import { useAppContext } from "../providers/AppContext"
import { getAvailableProducts, getCategoryName } from "@/lib/product-utils"
import CustomSelect from "../components/CustomSelect"

export default function ShopPage() {
  const { t, products, categories, language } = useAppContext()
  const shop = t("shop")
  const isRtl = language === "ar"

  // --- État existant, strictement inchangé ---
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
    return getAvailableProducts(products).filter((product) => {

      // Nom selon la langue
      const productName = (
        language === "ar"
          ? product.nameAr
          : product.nameFr
      )
        ?.toLowerCase()
        .trim() ?? ""

      const productDescription = (
        language === "ar"
          ? product.descriptionAr
          : product.descriptionFr
      )
        ?.toLowerCase()
        .trim() ?? ""

      const searchTerm = searchQuery
        .toLowerCase()
        .trim()

      // --------------------------------
      // CATÉGORIE
      // --------------------------------

      const productCategoryId =
        product.categoryId ??
        product.category?.id ??
        null

      const matchesCategory =
        selectedCategoryId === null ||
        productCategoryId === selectedCategoryId

      // --------------------------------
      // RECHERCHE
      // --------------------------------

      const matchesSearch =
        !searchTerm ||
        productName.includes(searchTerm) ||
        productDescription.includes(searchTerm)

      // --------------------------------
      // PRIX
      // --------------------------------

      const matchesPrice =
        (product.price || 0) <= maxPrice

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice
      )
    })
  }, [
    products,
    language,
    maxPrice,
    searchQuery,
    selectedCategoryId
  ])
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

  const hasActiveFilters = Boolean(selectedCategoryId) || Boolean(searchQuery) || maxPrice < 10000

  const resetFilters = () => {
    setSelectedCategoryId(null)
    setSearchQuery("")
    setMaxPrice(10000)
  }

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

          {/* Barre de filtres */}
          <div className="relative z-50 mb-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Recherche */}
            <div className="group relative flex h-[68px] flex-col justify-center rounded-[20px] border border-white/10 bg-[#111111]/80 px-5 backdrop-blur transition-colors duration-300 focus-within:border-[#c9a84c] focus-within:shadow-[0_0_0_3px_rgba(201,168,76,0.12)] hover:border-[#c9a84c]/30">
              <Search
                className={`pointer-events-none absolute top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-white/35 transition-colors duration-300 group-focus-within:text-[#c9a84c] ${isRtl ? "right-5" : "left-5"
                  }`}
              />
              <input
                type="text"
                placeholder={shop.search}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                dir={isRtl ? "rtl" : "ltr"}
                className={`w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/30 ${isRtl ? "pr-8 text-right" : "pl-8 text-left"
                  }`}
              />
            </div>

            {/* Catégorie */}
            <div className="h-[68px] [&>*]:flex [&>*]:h-full [&>*]:items-center">
              {/*
                Hauteur désormais fixe (68px) et identique sur les 3 blocs,
                au lieu de dépendre du contenu le plus haut : Recherche et
                Prix ont été réduits pour matcher la taille naturelle de
                CustomSelect, plutôt que d'étirer CustomSelect vers eux.
                `[&>*]:h-full` force juste son élément racine à occuper
                exactement ces 68px (sinon un select plus bas que 68px
                laisserait un espace vide, comme précédemment).
              */}
              <CustomSelect
                value={selectedCategoryId ?? ""}
                options={categoryOptions}
                placeholder={shop.all}
                onChange={(value) => setSelectedCategoryId(value || null)}
              />
            </div>

            {/* Prix */}
            <div className="flex h-[68px] flex-col justify-center gap-1.5 rounded-[20px] border border-white/10 bg-[#111111]/80 px-5 backdrop-blur transition-colors duration-300 hover:border-[#c9a84c]/30 focus-within:border-[#c9a84c] focus-within:shadow-[0_0_0_3px_rgba(201,168,76,0.12)]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">{shop.price}</span>
                <span className="font-medium text-[#c9a84c]">
                  {maxPrice.toLocaleString(isRtl ? "ar-MA" : "fr-FR")} MAD
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                dir="ltr"
                className="w-full accent-[#c9a84c]"
              />

              <div className="flex items-center justify-between text-[10px] text-white/35">
                <span>100 MAD</span>
                <span>10 000 MAD</span>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <SearchX className="h-7 w-7 text-[#c9a84c]" />
              </div>
              <p className="mb-6 max-w-md text-lg text-white/85">{shop.noResults}</p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="rounded-2xl border border-[#c9a84c]/50 bg-[#c9a84c]/10 px-8 py-3 text-sm font-medium text-[#e8c97e] transition-colors duration-300 hover:border-[#c9a84c] hover:bg-[#c9a84c]/20"
                >
                  {shop.reset}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}