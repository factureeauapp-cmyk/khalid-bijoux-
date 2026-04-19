"use client"

import React, { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAppContext } from "../providers/AppContext"

export default function ContactPage() {
  const { t } = useAppContext()
  const contact = t("contact")
  const [sent, setSent] = useState(false)

  return (
    <main className="min-h-screen bg-black pt-28 text-white">
      <Navbar />
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#c9a84c]">Khalid Bijoux</p>
            <h1 className="text-4xl font-cormorant md:text-6xl">{contact.title}</h1>
            <p className="max-w-xl text-lg text-white/70">{contact.subtitle}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">Casablanca, Maroc</div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">+212 6 00 00 00 00</div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">contact@khalidbijoux.com</div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">Lun - Sam, 10h à 19h</div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="mb-6 text-2xl font-cormorant">{contact.formTitle}</h2>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              <input placeholder={contact.name} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
              <input placeholder={contact.email} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
              <input placeholder={contact.subject} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
              <textarea placeholder={contact.message} className="min-h-36 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
              <button className="btn-primary w-full">{contact.send}</button>
            </form>
            {sent && <p className="mt-4 text-sm text-green-400">Message envoyé.</p>}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
