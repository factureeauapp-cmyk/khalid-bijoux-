"use client"

import React, { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AlertBox from "@/components/AlertBox"
import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"

interface ErrorAlert {
  id: string
  message: string
}

export default function CartPage() {
  const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { t, language } = useAppContext()
  const cartLabels = t("cart")
  const [customerName, setCustomerName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessages, setErrorMessages] = useState<ErrorAlert[]>([])

  const orderItems = useMemo(() => 
    cart.map((item) => ({
      productId: item.id,
      productNameFr: item.nameFr || "",
      productNameAr: item.nameAr || "",
      quantity: item.quantity,
      unitPrice: item.price,
      image: item.image,
    })), [cart]
  )

  const getProductName = (item: any) => {
    return language === "ar" ? item.nameAr : item.nameFr
  }

  const validateForm = (): boolean => {
    const newErrors: ErrorAlert[] = []

    if (!customerName?.trim()) {
      newErrors.push({
        id: "name",
        message: "Veuillez entrer votre nom complet."
      })
    }

    if (!address?.trim()) {
      newErrors.push({
        id: "address",
        message: "Veuillez entrer votre adresse de livraison."
      })
    }

    if (!phone?.trim()) {
      newErrors.push({
        id: "phone",
        message: "Veuillez entrer votre numéro de téléphone."
      })
    }

    if (cart.length === 0) {
      newErrors.push({
        id: "cart",
        message: "Votre panier est vide. Veuillez ajouter des articles avant de commander."
      })
    }

    if (newErrors.length > 0) {
      setErrorMessages(newErrors)
      return false
    }

    return true
  }

  const handleOrder = async () => {
    // Clear previous messages
    setErrorMessages([])
    setSuccessMessage("")

    // Validate form
    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          address,
          phone,
          notes,
          items: orderItems,
          total: totalPrice,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || data.message || "Impossible de créer la commande. Veuillez réessayer."
        setErrorMessages([{
          id: "api-error",
          message: errorMessage
        }])
        return
      }

      // Success!
      setSuccessMessage(data.message || "Commande créée avec succès ! 🎉 Nous vous contacterons bientôt.")
      
      // Clear form and cart
      clearCart()
      setCustomerName("")
      setAddress("")
      setPhone("")
      setNotes("")

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      console.error("Order error:", error)
      setErrorMessages([{
        id: "network-error",
        message: "Erreur réseau : impossible de créer la commande. Veuillez vérifier votre connexion et réessayer."
      }])
    } finally {
      setIsSubmitting(false)
    }
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
                        alt={getProductName(item) || "Article du panier"} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 100px"
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-2xl font-cormorant text-white">{getProductName(item)}</h2>
                      <p className="text-lg font-semibold text-[#e8c97e]">{item.price} MAD</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        disabled={item.quantity <= 1}
                        className="rounded-full border border-white/10 px-3 py-1 text-white disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="rounded-full border border-white/10 px-3 py-1 text-white hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-sm text-red-400 hover:text-red-300"
                    >
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

                {/* Error Messages */}
                {errorMessages.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {errorMessages.map((error) => (
                      <AlertBox
                        key={error.id}
                        type="error"
                        message={error.message}
                        autoClose={0}
                        onClose={() => setErrorMessages(msgs => msgs.filter(m => m.id !== error.id))}
                      />
                    ))}
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="mb-4">
                    <AlertBox
                      type="success"
                      message={successMessage}
                      autoClose={5000}
                      onClose={() => setSuccessMessage("")}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <input 
                    type="text"
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={cartLabels.customerName} 
                    disabled={isSubmitting}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none disabled:opacity-50" 
                  />
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={cartLabels.address} 
                    disabled={isSubmitting}
                    className="min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none disabled:opacity-50" 
                  />
                  <input 
                    type="tel"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={cartLabels.phone} 
                    disabled={isSubmitting}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none disabled:opacity-50" 
                  />
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={cartLabels.notesPlaceholder} 
                    disabled={isSubmitting}
                    className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none disabled:opacity-50" 
                  />
                </div>

                <div className="my-6 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between text-white">
                    <span>{cartLabels.total}</span>
                    <span className="text-2xl font-bold text-[#e8c97e]">{totalPrice} MAD</span>
                  </div>
                </div>

                <button 
                  onClick={handleOrder} 
                  disabled={isSubmitting || cart.length === 0}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    cartLabels.confirm
                  )}
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}

