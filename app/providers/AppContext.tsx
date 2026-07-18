"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { defaultLanguage, languages, translations, type Language } from "@/lib/i18n"
import type { Category, CustomerOrder, Product } from "@/lib/store-types"

type TranslationMap = typeof translations.fr

interface AppContextType {
  language: Language
  dir: "ltr" | "rtl"
  t: <K extends keyof TranslationMap>(namespace: K) => TranslationMap[K]
  setLanguage: (language: Language) => void
  products: Product[]
  categories: Category[]
  orders: CustomerOrder[]
  refreshProducts: () => Promise<void>
  refreshCategories: () => Promise<void>
  refreshOrders: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  // Always initialize with default language to match server render
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  // Track when component is mounted to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  // Track if language has been restored from localStorage to prevent infinite loops
  const languageRestoredRef = useRef(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<CustomerOrder[]>([])

  const refreshProducts = useCallback(async () => {
   const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
  {
    cache: "no-store",
  }
)
    if (!response.ok) {
      setProducts([])
      return
    }
    setProducts(await response.json())
  }, [])

  const refreshCategories = useCallback(async () => {
    const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, { cache: "no-store" })
    if (!response.ok) {
      setCategories([])
      return
    }
    setCategories(await response.json())
  }, [])

  const refreshOrders = useCallback(async () => {
    const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, { cache: "no-store" })
    if (!response.ok) {
      setOrders([])
      return
    }
    setOrders(await response.json())
  }, [])

  useEffect(() => {
    void refreshProducts()
    void refreshCategories()
  }, [refreshCategories, refreshProducts])

  // HYDRATION FIX: This runs only on the client after hydration completes
  // Restores user's language preference from localStorage without causing hydration mismatch
  useEffect(() => {
    // Defer localStorage access to next tick to ensure hydration is complete
    Promise.resolve().then(() => {
      if (!languageRestoredRef.current) {
        const savedLanguage = localStorage.getItem("kb-language") as Language | null
        if (savedLanguage && savedLanguage !== language) {
          setLanguageState(savedLanguage)
        }
        languageRestoredRef.current = true
      }
      setMounted(true)
    })
  }, []) // Empty dependency array - runs only once after mount

  // Update DOM attributes when language changes
  useEffect(() => {
    const currentLanguage = languages.find((entry) => entry.code === language) ?? languages[0]
    document.documentElement.lang = language
    document.documentElement.dir = currentLanguage.dir
    document.body.dir = currentLanguage.dir
    // Only update localStorage after hydration is complete
    if (mounted) {
      localStorage.setItem("kb-language", language)
    }
  }, [language, mounted])

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage)
  }, [])

  const value = useMemo<AppContextType>(() => {
    const currentLanguage = languages.find((entry) => entry.code === language) ?? languages[0]
    return {
      language,
      dir: currentLanguage.dir,
      t: ((namespace: keyof TranslationMap) => translations[language][namespace as never]) as <K extends keyof TranslationMap>(namespace: K) => TranslationMap[K],
      setLanguage,
      products,
      categories,
      orders,
      refreshProducts,
      refreshCategories,
      refreshOrders,
    }
  }, [categories, language, orders, products, refreshCategories, refreshOrders, refreshProducts, setLanguage])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider")
  }
  return context
}
