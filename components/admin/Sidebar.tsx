"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Boxes,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react"
import { useMemo } from "react"

import { useAppContext } from "@/app/providers/AppContext"

interface SidebarProps {
  /** Affiche le bouton X et le déclenche — présent uniquement dans le drawer mobile */
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useAppContext()

  const admin = t("admin")

  const activePath = useMemo(() => pathname || "/admin", [pathname])

  const navItems = [
    { href: "/admin", label: admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/products", label: admin.products, icon: Package },
    { href: "/admin/stock", label: admin.stock, icon: Boxes },
    { href: "/admin/orders", label: admin.orders, icon: ShoppingCart },
    { href: "/admin/settings", label: admin.settings, icon: Settings },
  ]

  return (
    <div className="flex h-full flex-col rounded-r-3xl border-r border-white/10 bg-[#060606] p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-cormorant text-[#c9a84c]">Khalid Bijoux</h2>
          <p className="text-xs text-white/50">{admin.dashboardTitle}</p>
        </div>

        {onClose && (
          <button
            type="button"
            className="rounded-full border border-white/10 p-2 text-white/70 md:hidden"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            activePath === item.href || (item.href !== "/admin" && activePath.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-[#c9a84c] text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-[#c9a84c]/20 bg-[#c9a84c]/10 p-4">
        <p className="font-semibold text-[#f3d57f]">{admin.managementMode}</p>
        <p className="mt-1 text-xs text-[#f3d57f]/80">{admin.realTimeStock}</p>
      </div>
    </div>
  )
}