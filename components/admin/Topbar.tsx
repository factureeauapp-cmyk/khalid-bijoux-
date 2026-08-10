"use client"

import { Bell, Menu, Search, User } from "lucide-react"
import { useAppContext } from "@/app/providers/AppContext"

interface TopbarProps {
  title: string
  onMenuClick: () => void
}

export function Topbar({
  title,
  onMenuClick,
}: TopbarProps) {
  const { t } = useAppContext()

  const admin = t("admin")

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#060606]/90 px-6 py-4 backdrop-blur">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <button
            onClick={onMenuClick}
            className="rounded-xl border border-white/10 p-2 text-white md:hidden"
          >
            <Menu size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-cormorant text-white">
              {title}
            </h1>

            <p className="text-sm text-white/50">
              {admin.dashboardTitle}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <button className="rounded-xl border border-white/10 p-2 text-white/70 hover:bg-white/10">
            <Search size={18} />
          </button>

          <button className="rounded-xl border border-white/10 p-2 text-white/70 hover:bg-white/10">
            <Bell size={18} />
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 hover:bg-white/10">

            <User size={18} />

            <span className="hidden text-sm md:block">
              Admin
            </span>

          </button>

        </div>

      </div>

    </header>
  )
}