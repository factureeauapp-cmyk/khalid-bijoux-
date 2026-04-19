import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[#c9a84c]/30 bg-white/5">
        <Image 
          src="/khalid-bijoux.png" 
          alt="Logo Khalid Bijoux" 
          fill 
          className="object-cover" 
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f6e7b5]">Khalid</span>
        <span className="text-lg font-cormorant font-bold leading-none text-white">Bijoux</span>
      </div>
    </Link>
  )
}
