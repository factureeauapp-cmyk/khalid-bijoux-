"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Truck, Gem } from "lucide-react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProductCard from "./components/ProductCard"
import { useAppContext } from "./providers/AppContext"
import { PRODUCTS } from "@/lib/data"

export default function HomePage() {
  const { t, products } = useAppContext()
  const home = t("home")
  const catalog = products.length ? products : PRODUCTS
  const featuredProducts = catalog.slice(0, 4)

  return (
    <main className="min-h-screen overflow-hidden bg-black">
      <Navbar />

      <section className="relative flex min-h-screen items-center px-6 pt-24 md:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.2),transparent_45%)]" />
        <div className="absolute right-[-120px] top-24 h-[420px] w-[420px] rounded-full bg-[#c9a84c]/10 blur-[110px]" />
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="relative z-10 space-y-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#c9a84c]">{home.kicker}</p>
            <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] text-white md:text-7xl">
              {home.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#ddd3c2]">
              {home.subtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/shop" className="btn-primary inline-flex items-center justify-center">
                {home.ctaPrimary}
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link href="/cart" className="btn-secondary inline-flex items-center justify-center">
                {home.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Gem, title: home.features[0].title, desc: home.features[0].desc },
              { icon: ShieldCheck, title: home.features[1].title, desc: home.features[1].desc },
              { icon: Truck, title: home.features[2].title, desc: home.features[2].desc },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:last:col-span-2"
              >
                <item.icon className="mb-4 text-[#c9a84c]" />
                <h3 className="mb-2 text-2xl font-cormorant text-white">{item.title}</h3>
                <p className="text-sm leading-6 text-[#d0c7b7]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#c9a84c]">{home.sectionTitle}</p>
              <h2 className="text-4xl font-cormorant text-white md:text-5xl">Khalid Bijoux</h2>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-[#e8c97e] transition hover:text-white">
              {home.ctaPrimary}
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
