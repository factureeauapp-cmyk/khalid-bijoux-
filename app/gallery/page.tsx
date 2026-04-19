"use client"

import Image from "next/image"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAppContext } from "../providers/AppContext"

const showcase = [
  "/images/rings/ring_01.jpg",
  "/images/earrings/earring_01.png",
  "/images/necklaces/necklace_01.png",
  "/images/bracelets/bracelet_01.png",
  "/images/cart/set_01.png",
  "/images/rings/ring_04.jpg",
]

export default function GalleryPage() {
  const { t } = useAppContext()
  const gallery = t("gallery")

  return (
    <main className="min-h-screen bg-black pt-28 text-white">
      <Navbar />
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 space-y-4 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#c9a84c]">Khalid Bijoux</p>
            <h1 className="text-4xl font-cormorant md:text-6xl">{gallery.title}</h1>
            <p className="text-white/70">{gallery.subtitle}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((src) => (
              <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                <Image 
                  src={src || "/placeholder.svg"} 
                  alt="Galerie Khalid Bijoux" 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
