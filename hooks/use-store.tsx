"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Product } from "@/data/products"

interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
}

interface WishlistItem {
  product: Product
}

interface StoreContextType {
  cart: CartItem[]
  wishlist: WishlistItem[]
  isCartOpen: boolean
  isQuickViewOpen: boolean
  quickViewProduct: Product | null
  addToCart: (product: Product, quantity: number, size: string) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (product: Product) => void
  isInWishlist: (productId: string) => boolean
  setIsCartOpen: (open: boolean) => void
  openQuickView: (product: Product) => void
  closeQuickView: () => void
  cartTotal: number
  cartCount: number
  wishlistCount: number
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const addToCart = useCallback((product: Product, quantity: number, size: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedSize === size)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity, selectedSize: size }]
    })
    setIsCartOpen(true)
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.product.id === product.id)
      if (exists) {
        return prev.filter((item) => item.product.id !== product.id)
      }
      return [...prev, { product }]
    })
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((item) => item.product.id === productId),
    [wishlist]
  )

  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
  }, [])

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false)
    setQuickViewProduct(null)
  }, [])

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)
  const wishlistCount = wishlist.length

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        isQuickViewOpen,
        quickViewProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setIsCartOpen,
        openQuickView,
        closeQuickView,
        cartTotal,
        cartCount,
        wishlistCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
