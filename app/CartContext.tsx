"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { CartItem, Product, SelectedAttributes } from "@/lib/store-types"
import {
  buildSelectedCartAttributes,
  buildVariantKey,
  replaceSelectedCartAttribute,
} from "@/lib/products/attributes"

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, selectedAttributes?: SelectedAttributes) => void
  removeFromCart: (variantKey: string) => void
  updateQuantity: (variantKey: string, quantity: number) => void
  /** Modifie UN attribut d'une ligne déjà présente dans le panier (ex: changer la couleur depuis CartPage). */
  updateItemAttribute: (variantKey: string, attributeId: string, valueId: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isHydrated: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = "khalid_bijoux_cart"

/**
 * Répare les anciens paniers sauvegardés en localStorage qui n'ont pas
 * encore `selectedAttributes` / `variantKey` (point 11 du cahier des
 * charges). Ne fait jamais planter l'app si le format est inattendu.
 */
function normalizeStoredCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return []

  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => {
      const selectedAttributes = Array.isArray(item.selectedAttributes) ? item.selectedAttributes : []
      const productId = String(item.id)
      const variantKey =
        typeof item.variantKey === "string" && item.variantKey
          ? item.variantKey
          : buildVariantKey(productId, selectedAttributes as CartItem["selectedAttributes"])

      return {
        ...item,
        selectedAttributes,
        variantKey,
      } as CartItem
    })
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedCart = window.localStorage.getItem(STORAGE_KEY)
      if (savedCart) {
        try {
          setCart(normalizeStoredCart(JSON.parse(savedCart)))
        } catch {
          setCart([])
        }
      }
      setIsHydrated(true)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart, isHydrated])

  const addToCart = (product: Product, selectedAttributes: SelectedAttributes = {}) => {
    const selectedCartAttributes = buildSelectedCartAttributes(product, selectedAttributes)
    const variantKey = buildVariantKey(product.id, selectedCartAttributes)

    console.log("========== ADD TO CART ==========")
    console.log("Product:", product.id)
    console.log("Selected attributes:", selectedAttributes)
    console.log("Cart item key:", variantKey)
    console.log("=================================")

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.variantKey === variantKey)

      if (existingItem) {
        return prevCart.map((item) =>
          item.variantKey === variantKey ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      const newItem: CartItem = {
        ...product,
        quantity: 1,
        selectedAttributes: selectedCartAttributes,
        variantKey,
      }

      return [...prevCart, newItem]
    })
  }

  const removeFromCart = (variantKey: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.variantKey !== variantKey))
  }

  const updateQuantity = (variantKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantKey)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.variantKey === variantKey ? { ...item, quantity } : item
      )
    )
  }

  /**
   * Change la valeur d'un seul attribut sur une ligne de panier existante.
   *
   * - Si la nouvelle configuration correspond à une variante DÉJÀ présente
   *   dans le panier -> fusionne les quantités dans cette ligne et supprime
   *   l'ancienne (jamais deux lignes identiques).
   * - Sinon -> met simplement à jour selectedAttributes + variantKey sur la
   *   ligne existante, en conservant sa quantité.
   */
  const updateItemAttribute = (variantKey: string, attributeId: string, valueId: string) => {
    setCart((prevCart) => {
      const targetItem = prevCart.find((item) => item.variantKey === variantKey)
      if (!targetItem) return prevCart

      const newSelectedAttributes = replaceSelectedCartAttribute(
        targetItem.selectedAttributes ?? [],
        targetItem.attributes,
        attributeId,
        valueId
      )

      const newVariantKey = buildVariantKey(targetItem.id, newSelectedAttributes)

      console.log("========== UPDATE ITEM ATTRIBUTE ==========")
      console.log("Variant key (avant):", variantKey)
      console.log("Attribute id:", attributeId)
      console.log("Value id:", valueId)
      console.log("Variant key (après):", newVariantKey)
      console.log("============================================")

      // Aucun changement effectif (valeur déjà sélectionnée, ou attribut/valeur introuvable)
      if (newVariantKey === variantKey) {
        return prevCart
      }

      const collidingItem = prevCart.find(
        (item) => item.variantKey === newVariantKey && item.variantKey !== variantKey
      )

      if (collidingItem) {
        // La nouvelle configuration existe déjà : on fusionne les quantités
        // dans cette ligne et on retire l'ancienne — jamais deux lignes
        // identiques dans le panier.
        return prevCart
          .filter((item) => item.variantKey !== variantKey)
          .map((item) =>
            item.variantKey === newVariantKey
              ? { ...item, quantity: item.quantity + targetItem.quantity }
              : item
          )
      }

      return prevCart.map((item) =>
        item.variantKey === variantKey
          ? { ...item, selectedAttributes: newSelectedAttributes, variantKey: newVariantKey }
          : item
      )
    })
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemAttribute,
        clearCart,
        totalItems,
        totalPrice,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}