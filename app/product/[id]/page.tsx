"use client"

import React, { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, BadgeCheck, Gem, ShieldCheck, ShoppingBag, Sparkles, Truck } from "lucide-react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"
import { useCart } from "../../CartContext"
import { useAppContext } from "../../providers/AppContext"
import { getCategoryById, getCategoryName, getProductDescription, getProductName } from "@/lib/product-utils"
import type { Product } from "@/lib/store-types"
import { PRODUCTS } from "@/lib/data"

interface ProductWithGallery extends Product {
  images?: string[]
  gallery?: string[]
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { products, categories, language, dir, t } = useAppContext()
  const productLabels = t("product")
  const catalog: Product[] = (products.length ? products : PRODUCTS).map((entry) => {
    if ("nameFr" in entry && "descriptionFr" in entry && "categoryId" in entry) {
      return entry as Product
    }

    return {
      id: entry.id,
      nameFr: entry.name,
      nameAr: entry.name,
      categoryId: "",
      price: entry.price,
      originalPrice: entry.originalPrice,
      tag: entry.tag,
      descriptionFr: entry.description,
      descriptionAr: entry.description,
      image: entry.image,
    }
  })
  const product = catalog.find((entry) => entry.id === id)
  const { addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState("/placeholder.svg")
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image)
    }
  }, [product?.image])

  useEffect(() => {
    if (!showToast) {
      return
    }

    const timer = window.setTimeout(() => setShowToast(false), 2200)
    return () => window.clearTimeout(timer)
  }, [showToast])

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#121212] px-8 py-10 shadow-[0_0_50px_rgba(201,168,76,0.12)]">
          <p className="text-lg font-cormorant">Produit introuvable.</p>
        </div>
      </main>
    )
  }

  const productName = getProductName(product, language)
  const productDescription = getProductDescription(product, language)
  const category = product.categoryId ? getCategoryById(categories, product.categoryId) : null
  const categoryName = category ? getCategoryName(category, language) : language === "ar" ? "غير مصنف" : "Sans catégorie"
  const relatedProducts = catalog.filter((entry) => entry.categoryId === product.categoryId && entry.id !== product.id).slice(0, 4)
  const productWithGallery = product as ProductWithGallery
  const galleryImages = [product.image, ...(productWithGallery.images ?? []), ...(productWithGallery.gallery ?? [])]
    .filter((image, index, array) => Boolean(image) && array.indexOf(image) === index)

  const handleAddToCart = () => {
    addToCart(product)
    setShowToast(true)
  }

  return (
    <main className="min-h-screen bg-[#050505] pt-24 text-white">
      <Navbar />
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed left-1/2 top-24 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-200 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur"
        >
          <BadgeCheck size={18} />
          {language === "ar" ? "✓ تم إضافة المنتج إلى السلة" : "✓ Produit ajouté au panier"}
        </motion.div>
      )}

      <section className="px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/shop"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#d8cfbf] transition hover:text-[#C9A84C]"
          >
            <ArrowLeft size={16} />
            {productLabels.back}
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#141414] shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                <div className="absolute left-4 top-4 z-20">
                  {product.tag ? (
                    <span className="rounded-full border border-[#C9A84C]/30 bg-linear-to-r from-[#C9A84C] via-[#E8C97E] to-[#C9A84C] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0D0D0D] shadow-lg">
                      {product.tag}
                    </span>
                  ) : null}
                </div>
                <div className="relative aspect-4/5 overflow-hidden">
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt={productName || "Produit"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {galleryImages.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`relative aspect-square overflow-hidden rounded-2xl border transition-all ${selectedImage === image ? "border-[#C9A84C] shadow-[0_0_0_1px_rgba(201,168,76,0.35)]" : "border-white/10 hover:border-[#C9A84C]/50"}`}
                    >
                      <Image src={image} alt="Miniature produit" fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="space-y-4 rounded-[28px] border border-white/10 bg-linear-to-br from-[#111111] via-[#0f0f0f] to-[#171717] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C9A84C]">
                    {categoryName}
                  </p>
                  <h1 className="text-3xl font-cormorant text-white sm:text-4xl lg:text-5xl">
                    {productName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="text-3xl font-bold text-[#E8C97E]">{product.price} MAD</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-white/45 line-through">{product.originalPrice} MAD</span>
                    )}
                  </div>
                </div>

                <div className="rounded-[20px] border border-[#C9A84C]/20 bg-[#0A0A0A]/80 p-4 text-sm leading-7 text-[#d8cfbf]">
                  <div className="mb-3 flex items-center gap-2 text-[#E8C97E]">
                    <Sparkles size={16} />
                    <span className="font-semibold uppercase tracking-[0.24em]">
                      {language === "ar" ? "الوصف" : "Description"}
                    </span>
                  </div>
                  <p className="text-[15px] leading-8 text-[#e8e1d5]">{productDescription}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-[20px] border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-[#C9A84C]/40 hover:bg-white/8">
                    <div className="mb-3 inline-flex rounded-full bg-[#C9A84C]/10 p-2 text-[#E8C97E]">
                      <ShieldCheck size={18} />
                    </div>
                    <p className="text-sm font-semibold text-[#C9A84C]">{productLabels.cod}</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {language === "ar" ? "تأكيد الطلب والدفع عند الاستلام." : "Confirmez votre commande et payez au moment de la livraison."}
                    </p>
                  </motion.div>

                  <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-[20px] border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-[#C9A84C]/40 hover:bg-white/8">
                    <div className="mb-3 inline-flex rounded-full bg-[#C9A84C]/10 p-2 text-[#E8C97E]">
                      <Truck size={18} />
                    </div>
                    <p className="text-sm font-semibold text-[#C9A84C]">{productLabels.shipping}</p>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {language === "ar" ? "توصيل سريع ومؤمن للطلبات داخل المدينة." : "Livraison rapide et soignée pour une expérience fluide."}
                    </p>
                  </motion.div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-linear-to-r from-[#C9A84C] via-[#E8C97E] to-[#C9A84C] px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#0D0D0D] shadow-[0_12px_35px_rgba(201,168,76,0.22)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"
                  >
                    <ShoppingBag size={17} className="transition-transform duration-300 group-hover:rotate-6" />
                    {productLabels.order}
                  </button>
                  <Link
                    href="/contact"
                    className="flex flex-1 items-center justify-center rounded-[14px] border border-[#C9A84C] bg-transparent px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A84C] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:bg-[#C9A84C] hover:text-[#0D0D0D]"
                  >
                    {productLabels.contact}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="mt-16 rounded-[30px] border border-white/10 bg-[#0D0D0D] p-6 shadow-[0_16px_60px_rgba(0,0,0,0.35)] sm:p-8"
          >
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A84C]">
                  {language === "ar" ? "اكتشف المزيد" : "Découvrir davantage"}
                </p>
                <h2 className="mt-2 text-2xl font-cormorant text-white sm:text-3xl">
                  {language === "ar" ? "منتجات مشابهة" : "Produits similaires"}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#d8cfbf]">
                <Gem size={16} className="text-[#E8C97E]" />
                {language === "ar" ? "اختيار مختار بعناية" : "Sélection raffinée"}
              </div>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((entry) => (
                  <ProductCard key={entry.id} product={entry} />
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-dashed border-[#C9A84C]/20 bg-[#121212] p-8 text-center text-sm text-[#d8cfbf]">
                {language === "ar" ? "لا توجد منتجات مشابهة حالياً." : "Aucun produit similaire pour le moment."}
              </div>
            )}
          </motion.section>
        </div>
      </section>
      <Footer />
    </main>
  )
}
