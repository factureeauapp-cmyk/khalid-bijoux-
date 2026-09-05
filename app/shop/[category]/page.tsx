"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"

import { useAppContext } from "../../providers/AppContext"

import type { Product } from "@/lib/store-types"
import { getAvailableProducts } from "@/lib/product-utils"

export default function CategoryPage() {
  const params = useParams()

  const {
    products,
    language,
    categories,
  } = useAppContext()

  const [mounted, setMounted] = useState(false)

  // ============================================================
  // PARAMÈTRE DE LA CATÉGORIE
  // ============================================================

  const rawCategory =
    typeof params.category === "string"
      ? params.category
      : ""

  const categoryName = decodeURIComponent(rawCategory).trim()

  // ============================================================
  // HYDRATATION
  // ============================================================

  useEffect(() => {
    setMounted(true)
  }, [])

  // ============================================================
  // DIRECTION RTL / LTR
  // ============================================================

  useEffect(() => {
    document.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  // ============================================================
  // NORMALISER UNE CHAÎNE
  // ============================================================

  const normalize = (
    value: string | null | undefined
  ) => {
    return (value ?? "")
      .trim()
      .toLowerCase()
  }

  // ============================================================
  // TROUVER LA CATÉGORIE
  // ============================================================

  const matchingCategory = useMemo(() => {
    const normalizedUrlCategory =
      normalize(categoryName)

    if (!normalizedUrlCategory) {
      return null
    }

    return (
      categories.find((category) => {
        const nameFr = normalize(category.nameFr)
        const nameAr = normalize(category.nameAr)

        return (
          nameFr === normalizedUrlCategory ||
          nameAr === normalizedUrlCategory
        )
      }) ?? null
    )
  }, [categories, categoryName])

  // ============================================================
  // FILTRER LES PRODUITS
  // ============================================================

  const filteredProducts = useMemo(() => {
    if (!matchingCategory) {
      return []
    }

    const categoryId =
      String(matchingCategory.id)

    /*
     * On commence avec les produits disponibles.
     */
    const availableProducts =
      getAvailableProducts(products)

    /*
     * Une catégorie peut être présente dans le produit
     * sous deux formes :
     *
     * product.category.id
     *
     * ou
     *
     * product.categoryId
     *
     * On supporte les deux.
     */
    return availableProducts.filter((product) => {
      const productCategoryId =
        product.category?.id ??
        product.categoryId

      return (
        String(productCategoryId) === categoryId
      )
    })
  }, [products, matchingCategory])

  // ============================================================
  // TITRE DE LA CATÉGORIE
  // ============================================================

  const displayTitle = matchingCategory
    ? language === "ar"
      ? matchingCategory.nameAr
      : matchingCategory.nameFr
    : categoryName

  // ============================================================
  // ATTENDRE L'HYDRATATION
  // ============================================================

  if (!mounted) {
    return null
  }

  // ============================================================
  // CATÉGORIE VIDE
  // ============================================================

  if (!categoryName) {
    return (
      <main className="min-h-screen bg-black pt-28">
        <Navbar />

        <section className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-white/70">
              {language === "ar"
                ? "الفئة غير صالحة."
                : "Catégorie invalide."}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  // ============================================================
  // CATÉGORIE INTROUVABLE
  // ============================================================

  if (!matchingCategory) {
    return (
      <main className="min-h-screen bg-black pt-28">
        <Navbar />

        <section className="px-6 py-12 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-white/70">
              {language === "ar"
                ? "هذه الفئة غير موجودة."
                : "Cette catégorie n'existe pas."}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-black pt-28">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          CONTENU
      ====================================================== */}

      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HEADER CATÉGORIE
          ================================================== */}

          <div className="mb-12 text-center">

            <p className="text-[11px] uppercase tracking-[0.4em] text-[#C9A84C]">
              Khalid Bijoux
            </p>

            <h1 className="mt-4 font-cormorant text-4xl text-white md:text-6xl">
              {displayTitle}
            </h1>

          </div>

          {/* ==================================================
              PRODUITS
          ================================================== */}

          {filteredProducts.length > 0 ? (

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

          ) : (

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-white/70">

              {language === "ar"
                ? "لا توجد منتجات متاحة في هذه الفئة حاليًا."
                : "Aucune pièce disponible dans cette catégorie pour le moment."}

            </div>

          )}

        </div>
      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />

    </main>
  )
}