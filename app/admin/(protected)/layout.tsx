"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { Sidebar } from "@/components/admin/Sidebar"
import { Topbar } from "@/components/admin/Topbar"
import { useAppContext } from "@/app/providers/AppContext"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { t, language } = useAppContext()
  const admin = t("admin")

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    document.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  // Ferme le drawer automatiquement à chaque changement de page
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  const pageTitle = useMemo(() => {
    switch (pathname) {
      case "/admin":
        return admin.dashboard
      case "/admin/products":
        return admin.products
      case "/admin/stock":
        return admin.stock
      case "/admin/orders":
        return admin.orders
      case "/admin/settings":
        return admin.settings
      default:
        return admin.dashboardTitle
    }
  }, [pathname, admin])

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Sidebar Desktop */}
      <aside className="hidden md:block md:w-72 md:shrink-0">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile — seule et unique instance du drawer mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />

            <motion.div
              initial={{ x: language === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? "100%" : "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className={`absolute top-0 h-full w-[85%] max-w-sm ${
                language === "ar" ? "right-0" : "left-0"
              }`}
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={pageTitle} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}