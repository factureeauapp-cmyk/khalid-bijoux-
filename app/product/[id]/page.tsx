"use client"

import React, { use } from "react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"
import { useCart } from "../../CartContext"
import { useAppContext } from "../../providers/AppContext"
import { PRODUCTS } from "@/lib/data"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { products, t } = useAppContext()
  const productLabels = t("product")
  const catalog = products.length ? products : PRODUCTS
  const product = catalog.find((entry) => entry.id === id)
  const { addToCart } = useCart()

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Produit introuvable.
      </main>
    )
  }

  const relatedProducts = catalog.filter((entry) => (entry.category || "") === (product.category || "") && entry.id !== product.id).slice(0, 4)

  return (
    <main className="min-h-screen bg-black pt-28">
      <Navbar />
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/shop" className="mb-8 inline-flex text-sm text-[#d8cfbf] transition hover:text-[#c9a84c]">
            {productLabels.back}
          </Link>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-[#141414]">
              <Image 
                src={product.image || "/placeholder.svg"} 
                alt={product.name || "Produit"} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover" 
                priority
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.4em] text-[#c9a84c]">{product.category || "Sans catégorie"}</p>
                <h1 className="text-4xl font-cormorant text-white md:text-6xl">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-3xl font-bold text-[#e8c97e]">{product.price} MAD</span>
                  <span className="rounded-full border border-[#c9a84c]/30 px-4 py-2 text-sm text-white/70">{product.material}</span>
                </div>
              </div>

              <p className="text-lg leading-8 text-[#d6cebf]">{product.description}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-[#c9a84c]">{productLabels.cod}</p>
                  <p className="mt-2 text-sm text-white/70">Confirmez votre commande et payez au moment de la livraison.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-[#c9a84c]">{productLabels.shipping}</p>
                  <p className="mt-2 text-sm text-white/70">Un parcours simple et clair pour mobile et desktop.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button onClick={() => addToCart(product)} className="btn-primary flex-1">
                  {productLabels.order}
                </button>
                <Link href="/contact" className="btn-secondary flex-1 text-center">
                  {productLabels.contact}
                </Link>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="mb-8 text-3xl font-cormorant text-white">{productLabels.related}</h2>
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((entry) => (
                  <ProductCard key={entry.id} product={entry} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
