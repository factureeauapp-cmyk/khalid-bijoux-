"use client"

import Link from "next/link"
import { MessageCircle, MapPin, Phone } from "lucide-react"
import { FaInstagram } from "react-icons/fa6";
import { useAppContext } from "../providers/AppContext"
import Logo from "./Logo"

export default function Footer() {
  const { t } = useAppContext()
  const nav = t("nav")
  const footer = t("footer")

  return (
    <footer className="relative overflow-hidden border-t border-[#C9A84C]/10 bg-[#0D0D0D] px-6 pb-12 pt-24 md:px-12">
      <div className="absolute left-1/2 top-0 -z-10 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-[#C9A84C]/5 blur-[120px]" />

      <div className="mx-auto mb-20 grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
        <div className="space-y-6">
          <Logo />
          <p className="max-w-xs text-[13px] font-medium leading-relaxed text-[#A0A0A0]">
            {footer.description}
          </p>
          <div className="flex space-x-5 text-[#A0A0A0]">
            {[FaInstagram, MessageCircle].map((Icon, i) => (
              <Link key={i} href="#" className="transition-colors hover:text-[#C9A84C]">
                <Icon size={20} strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A84C]">{nav.shop}</h4>
          <ul className="space-y-4 text-[13px] font-medium text-[#A0A0A0]">
            <li><Link href="/shop" className="transition-colors hover:text-[#C9A84C]">{nav.shop}</Link></li>
            <li><Link href="/shop/rings" className="transition-colors hover:text-[#C9A84C]">Rings</Link></li>
            <li><Link href="/shop/earrings" className="transition-colors hover:text-[#C9A84C]">Earrings</Link></li>
            <li><Link href="/shop/necklaces" className="transition-colors hover:text-[#C9A84C]">Necklaces</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A84C]">Navigation</h4>
          <ul className="space-y-4 text-[13px] font-medium text-[#A0A0A0]">
            <li><Link href="/" className="transition-colors hover:text-[#C9A84C]">{nav.home}</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-[#C9A84C]">{nav.about}</Link></li>
            <li><Link href="/gallery" className="transition-colors hover:text-[#C9A84C]">{nav.gallery}</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-[#C9A84C]">{nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A84C]">Contact</h4>
          <div className="space-y-4 text-[13px] font-medium text-[#A0A0A0]">
            <div className="flex items-center space-x-3">
              <MapPin size={14} className="text-[#C9A84C]" />
              <span>Casablanca, Maroc</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={14} className="text-[#C9A84C]" />
              <span>+212 6 00 00 00 00</span>
            </div>
            <p className="cursor-pointer transition-colors hover:text-[#C9A84C]">contact@khalidbijoux.com</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-12 text-[12px] text-[#A0A0A0]/70 md:flex-row">
        <p>© {new Date().getFullYear()} Khalid Bijoux. {footer.rights}</p>
        <div className="flex space-x-8">
          <Link href="/contact" className="transition-colors hover:text-[#C9A84C]">{nav.contact}</Link>
        </div>
      </div>
    </footer>
  )
}
