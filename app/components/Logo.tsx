"use client"

import Image from "next/image"
import Link from "next/link"
import { useAppContext } from "../providers/AppContext"
import { cn } from "@/lib/utils"

export default function Logo({ className }: { className?: string }) {
  const { t } = useAppContext()
  const brandName = t("brandName")

  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[#c9a84c]/30 bg-white/5">
        <Image
          src="/khalid-bijoux.png"
          alt={brandName}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="min-w-0">
        <span className="truncate text-lg font-cormorant font-bold leading-none text-white">{brandName}</span>
      </div>
    </Link>
  )
}
