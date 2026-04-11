"use client"

import { Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"

export function CartSlideOver() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
  } = useStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: siteConfig.currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl text-foreground">Shopping Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-6">Your cart is empty</p>
                  <Button
                    onClick={() => setIsCartOpen(false)}
                    className="gold-gradient text-primary-foreground"
                    asChild
                  >
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cart.map((item) => (
                    <motion.li
                      key={`${item.product.id}-${item.selectedSize}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.selectedSize}
                        </p>
                        <p className="text-primary font-medium mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 border border-border rounded hover:border-primary transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 border border-border rounded hover:border-primary transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto text-sm text-muted-foreground hover:text-destructive transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-xl text-primary">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
                <Button
                  className="w-full gold-gradient text-primary-foreground hover:opacity-90"
                  asChild
                >
                  <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  )
}
