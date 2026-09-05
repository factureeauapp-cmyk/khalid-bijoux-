"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Heart, SearchX } from "lucide-react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"

import { useAppContext } from "../providers/AppContext"
import type { Product } from "@/lib/store-types"

/*
 * =========================================================
 * WISHLIST PAGE
 * =========================================================
 *
 * Même structure que /shop :
 *
 * - Navbar
 * - Footer
 * - useAppContext
 * - traductions avec t()
 * - support FR / AR
 * - support RTL
 *
 * =========================================================
 */

export default function WishlistPage() {
  const {
    t,
    products,
    language,
  } = useAppContext()

  const isRtl = language === "ar"

  const [mounted, setMounted] = useState(false)

  /*
   * =========================================================
   * HYDRATATION
   * =========================================================
   */

  useEffect(() => {
    setMounted(true)
  }, [])

  /*
   * =========================================================
   * DIRECTION RTL
   * =========================================================
   */

  useEffect(() => {
    document.dir = isRtl ? "rtl" : "ltr"

    return () => {
      document.dir = "ltr"
    }
  }, [isRtl])

  /*
   * =========================================================
   * TRADUCTIONS
   * =========================================================
   */

  const wishlistTranslations = t("wishlist")

  /*
   * =========================================================
   * RÉCUPÉRATION DES FAVORIS
   * =========================================================
   *
   * La wishlist est enregistrée dans localStorage.
   *
   * On récupère uniquement les IDs des produits favoris,
   * puis on retrouve les vrais produits dans "products".
   *
   * Cela permet d'éviter les anciens objets Product incomplets
   * enregistrés dans localStorage.
   * =========================================================
   */

  const wishlistProducts = useMemo(() => {
    if (!mounted) {
      return []
    }

    try {
      const savedWishlist = localStorage.getItem(
        "khalid-bijoux-wishlist"
      )

      if (!savedWishlist) {
        return []
      }

      const parsed = JSON.parse(savedWishlist)

      if (!Array.isArray(parsed)) {
        return []
      }

      /*
       * Les anciennes données peuvent avoir cette structure :
       *
       * {
       *   product: {
       *     id: "..."
       *   }
       * }
       *
       * ou directement :
       *
       * {
       *   id: "..."
       * }
       */

      const wishlistIds = parsed
        .map((item) => {
          if (
            item &&
            typeof item === "object" &&
            "product" in item &&
            item.product &&
            typeof item.product === "object"
          ) {
            return item.product.id
          }

          if (
            item &&
            typeof item === "object"
          ) {
            return item.id
          }

          return null
        })
        .filter(
          (id): id is string =>
            typeof id === "string" &&
            id.trim() !== ""
        )

      /*
       * Retrouver les vrais produits venant de l'API.
       */

      const foundProducts = wishlistIds
        .map((id) =>
          products.find(
            (product) => product.id === id
          )
        )
        .filter(
          (product): product is Product =>
            Boolean(product)
        )

      /*
       * Suppression des doublons.
       */

      return Array.from(
        new Map(
          foundProducts.map((product) => [
            product.id,
            product,
          ])
        ).values()
      )
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la wishlist :",
        error
      )

      return []
    }
  }, [products, mounted])

  /*
   * =========================================================
   * ATTENDRE HYDRATATION
   * =========================================================
   */

  if (!mounted) {
    return null
  }

  /*
   * =========================================================
   * TEXTES AVEC FALLBACK
   * =========================================================
   *
   * Les fallbacks évitent une erreur si les clés de traduction
   * wishlist ne sont pas encore présentes.
   * =========================================================
   */

  const title =
    wishlistTranslations?.title ??
    (isRtl ? "قائمة المفضلة" : "Ma liste de souhaits")

  const subtitle =
    wishlistTranslations?.subtitle ??
    (isRtl
      ? "المنتجات التي أضفتها إلى قائمة المفضلة"
      : "Les produits que vous avez ajoutés à vos favoris")

  const itemText =
    wishlistTranslations?.item ??
    (isRtl ? "منتج" : "produit")

  const itemsText =
    wishlistTranslations?.items ??
    (isRtl ? "منتجات" : "produits")

  const savedText =
    wishlistTranslations?.saved ??
    (isRtl ? "محفوظة" : "enregistrés")

  const emptyTitle =
    wishlistTranslations?.emptyTitle ??
    (isRtl
      ? "قائمة المفضلة فارغة"
      : "Votre liste de souhaits est vide")

  const emptyDescription =
    wishlistTranslations?.emptyDescription ??
    (isRtl
      ? "ابدأ بإضافة المنتجات التي تحبها إلى قائمة المفضلة"
      : "Commencez à ajouter les produits que vous aimez à vos favoris")

  const exploreText =
    wishlistTranslations?.explore ??
    (isRtl
      ? "اكتشف المجموعة"
      : "Découvrir la collection")

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main
      className="min-h-screen bg-black pt-28"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <Navbar />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">

          {/* =================================================
              HEADER
              ================================================= */}

          <div
            className={`mb-12 space-y-4 ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#c9a84c]">
              Khalid Bijoux
            </p>

            <h1 className="text-4xl font-cormorant text-white md:text-6xl">
              {title}
            </h1>

            <p className="max-w-2xl text-[#d1c7b7]">
              {subtitle}
            </p>

            <p className="text-sm text-white/50">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1
                ? itemText
                : itemsText}{" "}
              {savedText}
            </p>
          </div>

          {/* =================================================
              EMPTY WISHLIST
              ================================================= */}

          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-20 text-center">

              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Heart className="h-9 w-9 text-[#c9a84c]" />
              </div>

              <h2 className="mb-4 text-2xl font-cormorant text-white md:text-3xl">
                {emptyTitle}
              </h2>

              <p className="mb-8 max-w-md text-white/50">
                {emptyDescription}
              </p>

              <Link
                href="/shop"
                className="rounded-2xl border border-[#c9a84c]/50 bg-[#c9a84c]/10 px-8 py-3 text-sm font-medium text-[#e8c97e] transition-all duration-300 hover:border-[#c9a84c] hover:bg-[#c9a84c]/20"
              >
                {exploreText}
              </Link>
            </div>
          ) : (

            /* =================================================
               PRODUCTS
               ================================================= */

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {wishlistProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <Footer />
    </main>
  )
}