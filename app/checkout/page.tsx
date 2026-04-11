"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, Truck, CreditCard, Banknote, Building2, Check } from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const paymentMethods = [
  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
  { id: "upi", label: "UPI Payment", icon: Banknote },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "cod", label: "Cash on Delivery", icon: Banknote },
]

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: siteConfig.currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const shipping = cartTotal > 50000 ? 0 : 500
  const tax = Math.round(cartTotal * 0.03) // 3% GST
  const total = cartTotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsComplete(true)
    clearCart()
  }

  if (cart.length === 0 && !isComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center py-16">
          <h1 className="font-serif text-3xl text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some beautiful jewellery to checkout</p>
          <Button className="gold-gradient text-primary-foreground" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-3xl text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We will send you a confirmation email shortly with your order details.
            </p>
            <Button className="gold-gradient text-primary-foreground" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-foreground">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-foreground">Shipping Address</h2>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="House no., Building name, Street"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="State"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="6-digit pincode"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-foreground">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      paymentMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <method.icon
                      className={cn(
                        "w-6 h-6 mb-2",
                        paymentMethod === method.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        paymentMethod === method.id
                          ? "text-primary"
                          : "text-foreground"
                      )}
                    >
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full gold-gradient text-primary-foreground hover:opacity-90 py-6 text-lg"
            >
              {isSubmitting ? "Processing..." : `Pay ${formatPrice(total)}`}
            </Button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span className="text-xs">Insured Shipping</span>
              </div>
            </div>
          </motion.form>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="font-serif text-xl text-foreground mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.selectedSize} | Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-primary mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (3%)</span>
                  <span className="text-foreground">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-serif text-lg text-foreground">Total</span>
                  <span className="font-serif text-xl gold-gradient-text">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {shipping === 0 && (
                <p className="text-xs text-primary text-center mt-4">
                  You qualify for free shipping!
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
