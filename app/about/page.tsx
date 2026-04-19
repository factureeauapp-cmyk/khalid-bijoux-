"use client"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAppContext } from "../providers/AppContext"

export default function AboutPage() {
  const { t } = useAppContext()
  const about = t("about")

  return (
    <main className="min-h-screen bg-black pt-28 text-white">
      <Navbar />
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-5xl space-y-8 rounded-[32px] border border-white/10 bg-white/5 p-8 md:p-12">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#c9a84c]">Khalid Bijoux</p>
          <h1 className="text-4xl font-cormorant md:text-6xl">{about.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-white/75">{about.subtitle}</p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <h2 className="mb-3 text-2xl font-cormorant">Design</h2>
              <p className="text-white/70">Nous construisons une identité visuelle élégante, claire et compatible mobile.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <h2 className="mb-3 text-2xl font-cormorant">Confiance</h2>
              <p className="text-white/70">Le parcours de commande a été simplifié avec paiement à la livraison uniquement.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <h2 className="mb-3 text-2xl font-cormorant">Administration</h2>
              <p className="text-white/70">Un espace admin permet désormais la gestion des produits et des commandes.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
