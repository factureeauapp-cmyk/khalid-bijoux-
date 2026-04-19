"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"

export default function CartPage() {
  const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { t } = useAppContext()
  const cartLabels = t("cart")
  const [customerName, setCustomerName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const orderItems = useMemo(() => cart.map((item) => ({
    productId: item.id,
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    image: item.image,
  })), [cart])

  const handleOrder = async () => {
    if (!customerName || !address || !phone || cart.length === 0) {
      return
    }

    setIsSubmitting(true)
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        address,
        phone,
        notes,
        items: orderItems,
        total: totalPrice,
      }),
    })

    if (response.ok) {
      setSuccessMessage(cartLabels.success)
      clearCart()
      setCustomerName("")
      setAddress("")
      setPhone("")
      setNotes("")
    }
    setIsSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-black pt-28">
      <Navbar />
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-10 text-4xl font-cormorant text-white md:text-6xl">{cartLabels.title}</h1>

          {cart.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center">
              <p className="mb-6 text-lg text-white">{cartLabels.empty}</p>
              <Link href="/shop" className="btn-primary">{cartLabels.continue}</Link>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl sm:w-28">
                      <Image 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.name || "Article du panier"} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 100px"
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-2xl font-cormorant text-white">{item.name}</h2>
                      <p className="text-sm text-white/60">{item.material}</p>
                      <p className="text-lg font-semibold text-[#e8c97e]">{item.price} MAD</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full border border-white/10 px-3 py-1 text-white">-</button>
                      <span className="min-w-8 text-center text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full border border-white/10 px-3 py-1 text-white">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-400">
                      {cartLabels.remove}
                    </button>
                  </div>
                ))}
              </div>

              <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <h2 className="mb-6 text-2xl font-cormorant text-white">{cartLabels.orderSummary}</h2>
                <div className="mb-6 rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/10 p-4 text-sm text-[#f1dfac]">
                  {cartLabels.payment}
                </div>
                <div className="space-y-4">
                  <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder={cartLabels.customerName} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
                  <textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder={cartLabels.address} className="min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder={cartLabels.phone} className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={cartLabels.notesPlaceholder} className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none" />
                </div>

                <div className="my-6 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between text-white">
                    <span>{cartLabels.total}</span>
                    <span className="text-2xl font-bold text-[#e8c97e]">{totalPrice} MAD</span>
                  </div>
                </div>

                <button onClick={handleOrder} disabled={isSubmitting} className="btn-primary w-full">
                  {isSubmitting ? "..." : cartLabels.confirm}
                </button>

                {successMessage && <p className="mt-4 text-sm text-green-400">{successMessage}</p>}
              </aside>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
