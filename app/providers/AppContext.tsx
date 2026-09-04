"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import {
  defaultLanguage,
  languages,
  translations,
  type Language,
} from "@/lib/i18n"

import type {
  Category,
  CustomerOrder,
  Product,
} from "@/lib/store-types"

type TranslationMap = typeof translations.fr

interface AppContextType {
  language: Language
  dir: "ltr" | "rtl"

  t: <K extends keyof TranslationMap>(
    namespace: K
  ) => TranslationMap[K]

  setLanguage: (language: Language) => void

  products: Product[]
  categories: Category[]
  orders: CustomerOrder[]

  refreshProducts: (
    availableOnly?: boolean
  ) => Promise<void>

  refreshCategories: () => Promise<void>

  refreshOrders: () => Promise<void>

  createCategory: (
    nameFr: string,
    nameAr: string
  ) => Promise<Category>

  // ================================
  // AUTH
  // ================================
  logout: () => void
}

const AppContext =
  createContext<AppContextType | undefined>(undefined)

export function AppProvider({
  children,
}: {
  children: ReactNode
}) {
  // ============================================================
  // LANGUAGE
  // ============================================================

  const [language, setLanguageState] =
    useState<Language>(defaultLanguage)

  const [mounted, setMounted] =
    useState(false)

  const languageRestoredRef =
    useRef(false)

  // ============================================================
  // GLOBAL DATA
  // ============================================================

  const [products, setProducts] =
    useState<Product[]>([])

  const [categories, setCategories] =
    useState<Category[]>([])

  const [orders, setOrders] =
    useState<CustomerOrder[]>([])

  // ============================================================
  // PRODUCTS
  // ============================================================

  const refreshProducts = useCallback(
    async (availableOnly = true) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products${
            availableOnly
              ? ""
              : "?availableOnly=false"
          }`,
          {
            cache: "no-store",
            credentials: "include",
          }
        )

        if (!response.ok) {
          setProducts([])
          return
        }

        const productsPayload =
          await response.json()

        setProducts(productsPayload)
      } catch (error) {
        console.error(
          "Erreur refreshProducts:",
          error
        )

        setProducts([])
      }
    },
    []
  )

  // ============================================================
  // CATEGORIES
  // ============================================================

  const refreshCategories = useCallback(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
          {
            cache: "no-store",
            credentials: "include",
          }
        )

        if (!response.ok) {
          setCategories([])
          return
        }

        const categoriesPayload =
          await response.json()

        setCategories(categoriesPayload)
      } catch (error) {
        console.error(
          "Erreur refreshCategories:",
          error
        )

        setCategories([])
      }
    },
    []
  )

  // ============================================================
  // CREATE CATEGORY
  // ============================================================

  const createCategory = useCallback(
    async (
      nameFr: string,
      nameAr: string
    ): Promise<Category> => {
      const token =
        localStorage.getItem("adminToken")

      if (!token) {
        throw new Error(
          "Session expirée. Veuillez vous reconnecter."
        )
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/categories`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            nameFr: nameFr.trim(),
            nameAr: nameAr.trim(),
          }),
        }
      )

      const data =
        await response
          .json()
          .catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            data.details?.[0] ||
            "Erreur lors de la création de la catégorie"
        )
      }

      const newCategory =
        data as Category

      await refreshCategories()

      return newCategory
    },
    [refreshCategories]
  )

  // ============================================================
  // ORDERS
  // ============================================================

  const refreshOrders = useCallback(
    async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
          {
            cache: "no-store",
            credentials: "include",
          }
        )

        if (!response.ok) {
          setOrders([])
          return
        }

        const ordersPayload =
          await response.json()

        setOrders(ordersPayload)
      } catch (error) {
        console.error(
          "Erreur refreshOrders:",
          error
        )

        setOrders([])
      }
    },
    []
  )

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = useCallback(() => {
    console.log(
      "[AUTH] Déconnexion administrateur..."
    )

    // ----------------------------------------------------------
    // Supprimer les tokens
    // ----------------------------------------------------------

    localStorage.removeItem(
      "adminToken"
    )

    localStorage.removeItem(
      "token"
    )

    // ----------------------------------------------------------
    // Supprimer les informations admin
    // ----------------------------------------------------------

    localStorage.removeItem(
      "admin"
    )

    localStorage.removeItem(
      "user"
    )

    // ----------------------------------------------------------
    // Supprimer d'éventuelles données d'auth
    // ----------------------------------------------------------

    localStorage.removeItem(
      "adminUser"
    )

    localStorage.removeItem(
      "accessToken"
    )

    localStorage.removeItem(
      "refreshToken"
    )

    // ----------------------------------------------------------
    // Supprimer les cookies frontend éventuels
    // ----------------------------------------------------------

    document.cookie =
      "token=; Max-Age=0; path=/"

    document.cookie =
      "adminToken=; Max-Age=0; path=/"

    document.cookie =
      "accessToken=; Max-Age=0; path=/"

    document.cookie =
      "refreshToken=; Max-Age=0; path=/"

    // ----------------------------------------------------------
    // Notifier les autres onglets/pages
    // ----------------------------------------------------------

    window.dispatchEvent(
      new Event("auth:logout")
    )

    console.log(
      "[AUTH] Déconnexion terminée."
    )
  }, [])

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    void refreshProducts()
    void refreshCategories()
  }, [
    refreshCategories,
    refreshProducts,
  ])

  // ============================================================
  // RESTORE LANGUAGE
  // ============================================================

  useEffect(() => {
    Promise.resolve().then(() => {
      if (!languageRestoredRef.current) {
        const savedLanguage =
          localStorage.getItem(
            "kb-language"
          ) as Language | null

        if (
          savedLanguage &&
          savedLanguage !== language
        ) {
          setLanguageState(
            savedLanguage
          )
        }

        languageRestoredRef.current =
          true
      }

      setMounted(true)
    })
  }, [language])

  // ============================================================
  // UPDATE HTML LANGUAGE / RTL
  // ============================================================

  useEffect(() => {
    const currentLanguage =
      languages.find(
        (entry) =>
          entry.code === language
      ) ?? languages[0]

    document.documentElement.lang =
      language

    document.documentElement.dir =
      currentLanguage.dir

    document.body.dir =
      currentLanguage.dir

    if (mounted) {
      localStorage.setItem(
        "kb-language",
        language
      )
    }
  }, [
    language,
    mounted,
  ])

  // ============================================================
  // SET LANGUAGE
  // ============================================================

  const setLanguage = useCallback(
    (newLanguage: Language) => {
      setLanguageState(newLanguage)
    },
    []
  )

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = useMemo<AppContextType>(
    () => {
      const currentLanguage =
        languages.find(
          (entry) =>
            entry.code === language
        ) ?? languages[0]

      return {
        language,

        dir: currentLanguage.dir,

        t: ((
          namespace: keyof TranslationMap
        ) =>
          translations[
            language
          ][namespace as never]) as <
          K extends keyof TranslationMap
        >(
          namespace: K
        ) => TranslationMap[K],

        setLanguage,

        products,
        categories,
        orders,

        refreshProducts,
        refreshCategories,
        refreshOrders,

        createCategory,

        // IMPORTANT
        logout,
      }
    },
    [
      language,
      products,
      categories,
      orders,

      refreshProducts,
      refreshCategories,
      refreshOrders,

      createCategory,
      setLanguage,

      logout,
    ]
  )

  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  )
}

// ============================================================
// HOOK
// ============================================================

export function useAppContext() {
  const context =
    useContext(AppContext)

  if (!context) {
    throw new Error(
      "useAppContext must be used inside AppProvider"
    )
  }

  return context
}