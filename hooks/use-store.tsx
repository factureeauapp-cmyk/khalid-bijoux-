"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"

import type { Product } from "@/lib/store-types"

/* =========================================================
   TYPES
========================================================= */

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

  addToCart: (
    product: Product,
    quantity: number,
    size: string
  ) => void

  removeFromCart: (productId: string) => void

  updateCartQuantity: (
    productId: string,
    quantity: number
  ) => void

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

/* =========================================================
   CONTEXT
========================================================= */

const StoreContext = createContext<
  StoreContextType | undefined
>(undefined)

/* =========================================================
   STORAGE KEY
========================================================= */

const WISHLIST_STORAGE_KEY = "khalid-bijoux-wishlist"

/* =========================================================
   STORE PROVIDER
========================================================= */

export function StoreProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =======================================================
     CART
  ======================================================= */

  const [cart, setCart] = useState<CartItem[]>([])

  /* =======================================================
     WISHLIST
  ======================================================= */

  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  /*
   * Très important :
   *
   * false = on n'a pas encore terminé le chargement
   * true  = localStorage a été chargé
   *
   * Cela empêche le premier render avec [] d'écraser
   * les données existantes dans localStorage.
   */
  const [wishlistHydrated, setWishlistHydrated] =
    useState(false)

  /* =======================================================
     UI STATE
  ======================================================= */

  const [isCartOpen, setIsCartOpen] = useState(false)

  const [isQuickViewOpen, setIsQuickViewOpen] =
    useState(false)

  const [quickViewProduct, setQuickViewProduct] =
    useState<Product | null>(null)

  /* =======================================================
     LOAD WISHLIST FROM LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    try {
      const savedWishlist = window.localStorage.getItem(
        WISHLIST_STORAGE_KEY
      )

      /*
       * Aucun favori enregistré
       */
      if (!savedWishlist) {
        setWishlist([])
        return
      }

      const parsedWishlist: unknown =
        JSON.parse(savedWishlist)

      /*
       * Vérification de base
       */
      if (!Array.isArray(parsedWishlist)) {
        console.warn(
          "[Wishlist] Données localStorage invalides."
        )

        setWishlist([])
        return
      }

      /*
       * Nettoyage des données
       *
       * On accepte uniquement :
       *
       * {
       *   product: {
       *     id: ...
       *   }
       * }
       */
      const validWishlist: WishlistItem[] =
        parsedWishlist.filter((item): item is WishlistItem => {
          if (!item || typeof item !== "object") {
            return false
          }

          const wishlistItem =
            item as Partial<WishlistItem>

          if (
            !wishlistItem.product ||
            typeof wishlistItem.product !== "object"
          ) {
            return false
          }

          const product =
            wishlistItem.product as Partial<Product>

          return (
            typeof product.id === "string" &&
            product.id.trim() !== ""
          )
        })

      /*
       * Éviter les doublons de produits
       */
      const uniqueWishlist =
        validWishlist.filter(
          (item, index, array) =>
            array.findIndex(
              (wishlistItem) =>
                wishlistItem.product.id ===
                item.product.id
            ) === index
        )

      setWishlist(uniqueWishlist)

      console.log(
        `[Wishlist] ${uniqueWishlist.length} favori(s) chargé(s) depuis localStorage.`
      )
    } catch (error) {
      console.error(
        "[Wishlist] Erreur lors du chargement :",
        error
      )

      setWishlist([])
    } finally {
      /*
       * Le chargement est terminé.
       *
       * L'effet de sauvegarde pourra maintenant fonctionner.
       */
      setWishlistHydrated(true)
    }
  }, [])

  /* =======================================================
     SAVE WISHLIST TO LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    /*
     * NE PAS sauvegarder avant le chargement initial.
     *
     * Sinon le [] initial peut écraser les favoris existants.
     */
    if (!wishlistHydrated) {
      return
    }

    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist)
      )

      console.log(
        `[Wishlist] ${wishlist.length} favori(s) sauvegardé(s).`
      )
    } catch (error) {
      console.error(
        "[Wishlist] Erreur lors de la sauvegarde :",
        error
      )
    }
  }, [wishlist, wishlistHydrated])

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = useCallback(
    (
      product: Product,
      quantity: number,
      size: string
    ) => {
      if (!product?.id) {
        console.warn(
          "[Cart] Produit invalide."
        )
        return
      }

      if (quantity <= 0) {
        console.warn(
          "[Cart] Quantité invalide :",
          quantity
        )
        return
      }

      setCart((prev) => {
        const existing = prev.find(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === size
        )

        /*
         * Produit déjà présent avec la même taille
         */
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id &&
            item.selectedSize === size
              ? {
                  ...item,
                  quantity:
                    item.quantity + quantity,
                }
              : item
          )
        }

        /*
         * Nouveau produit
         */
        return [
          ...prev,
          {
            product,
            quantity,
            selectedSize: size,
          },
        ]
      })

      setIsCartOpen(true)
    },
    []
  )

  /* =======================================================
     REMOVE FROM CART
  ======================================================= */

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            item.product.id !== productId
        )
      )
    },
    []
  )

  /* =======================================================
     UPDATE CART QUANTITY
  ======================================================= */

  const updateCartQuantity = useCallback(
    (
      productId: string,
      quantity: number
    ) => {
      /*
       * Si quantité <= 0
       * supprimer le produit.
       */
      if (quantity <= 0) {
        setCart((prev) =>
          prev.filter(
            (item) =>
              item.product.id !== productId
          )
        )

        return
      }

      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity,
              }
            : item
        )
      )
    },
    []
  )

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  /* =======================================================
     TOGGLE WISHLIST
  ======================================================= */

  const toggleWishlist = useCallback(
    (product: Product) => {
      /*
       * Vérification du produit
       */
      if (!product || !product.id) {
        console.warn(
          "[Wishlist] Impossible d'ajouter un produit invalide."
        )

        return
      }

      setWishlist((prev) => {
        const exists = prev.some(
          (item) =>
            item.product.id === product.id
        )

        /*
         * ===============================
         * REMOVE
         * ===============================
         */

        if (exists) {
          const updatedWishlist =
            prev.filter(
              (item) =>
                item.product.id !== product.id
            )

          console.log(
            `[Wishlist] Produit supprimé : ${product.id}`
          )

          return updatedWishlist
        }

        /*
         * ===============================
         * ADD
         * ===============================
         */

        console.log(
          `[Wishlist] Produit ajouté : ${product.id}`
        )

        return [
          ...prev,
          {
            product,
          },
        ]
      })
    },
    []
  )

  /* =======================================================
     CHECK IF PRODUCT IS IN WISHLIST
  ======================================================= */

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some(
        (item) =>
          item.product.id === productId
      )
    },
    [wishlist]
  )

  /* =======================================================
     OPEN QUICK VIEW
  ======================================================= */

  const openQuickView = useCallback(
    (product: Product) => {
      setQuickViewProduct(product)
      setIsQuickViewOpen(true)
    },
    []
  )

  /* =======================================================
     CLOSE QUICK VIEW
  ======================================================= */

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false)
    setQuickViewProduct(null)
  }, [])

  /* =======================================================
     CART TOTAL
  ======================================================= */

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.product.price || 0) *
        item.quantity,
    0
  )

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount = cart.reduce(
    (count, item) =>
      count + item.quantity,
    0
  )

  /* =======================================================
     WISHLIST COUNT
  ======================================================= */

  const wishlistCount = wishlist.length

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <StoreContext.Provider
      value={{
        /* Cart */
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        /* Wishlist */
        wishlist,
        toggleWishlist,
        isInWishlist,

        /* UI */
        isCartOpen,
        setIsCartOpen,

        isQuickViewOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,

        /* Counters */
        cartTotal,
        cartCount,
        wishlistCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

/* =========================================================
   USE STORE
========================================================= */

export function useStore() {
  const context = useContext(StoreContext)

  if (context === undefined) {
    throw new Error(
      "useStore must be used within a StoreProvider"
    )
  }

  return context
}