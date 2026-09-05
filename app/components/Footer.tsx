"use client"

import Link from "next/link"
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
} from "lucide-react"
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6"

import { useAppContext } from "../providers/AppContext"
import Logo from "./Logo"
import { SOCIAL_LINKS } from "@/config/socialLinks"


export default function Footer() {
  const { t, categories, language } = useAppContext()

  const nav = t("nav")
  const footer = t("footer")

  const whatsappNumber = "212618737715"




  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      href: SOCIAL_LINKS.instagram,
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      href: SOCIAL_LINKS.facebook,
    },
    {
      name: "TikTok",
      icon: FaTiktok,
      href: SOCIAL_LINKS.tiktok,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: SOCIAL_LINKS.whatsapp,
    },
  ]


  const shopCategories = categories.slice(0, 5)

  return (
    <footer className="relative overflow-hidden border-t border-[#C9A84C]/10 bg-[#0D0D0D] px-6 pb-8 pt-20 md:px-12">

      {/* Glow décoratif */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-[#C9A84C]/5 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ===================== MAIN FOOTER ===================== */}
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-5">

          {/* ===================== BRAND ===================== */}
          <div className="lg:col-span-2">

            <Logo />

            <p className="mt-6 max-w-md text-[13px] font-medium leading-7 text-[#A0A0A0]">
              {footer.description}
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-8">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A84C]">
                {footer.followUs || "Suivez-nous"}
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map(({ name, icon: Icon, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#A0A0A0] transition-all duration-300 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>

          </div>





          {/* ===================== BOUTIQUE ===================== */}
          <div>
            <h4 className="mb-7 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A84C]">
              {nav.shop}
            </h4>

            <ul className="space-y-4 text-[13px] font-medium text-[#A0A0A0]">

              {/* Toutes les catégories */}
              <li>
                <Link
                  href="/shop"
                  className="group flex items-center transition-colors hover:text-[#C9A84C]"
                >
                  <ChevronRight
                    size={13}
                    className="mr-1 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  />

                  {nav.shop}
                </Link>
              </li>

              {/* Maximum 5 catégories provenant du backend */}
              {shopCategories.map((category) => {
                const categoryName =
                  language === "ar"
                    ? category.nameAr
                    : category.nameFr

                return (
                  <li key={category.id}>
                    <Link
                      href={`/shop/${encodeURIComponent(categoryName)}`}
                      className="group flex items-center transition-colors hover:text-[#C9A84C]"
                    >
                      <ChevronRight
                        size={13}
                        className="mr-1 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                      />

                      <span>{categoryName}</span>
                    </Link>
                  </li>
                )
              })}

            </ul>
          </div>



          {/* ===================== NAVIGATION ===================== */}
          <div>
            <h4 className="mb-7 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A84C]">
              {footer.navigation || "Navigation"}
            </h4>

            <ul className="space-y-4 text-[13px] font-medium text-[#A0A0A0]">

              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-[#C9A84C]"
                >
                  {nav.home}
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#C9A84C]"
                >
                  {nav.about}
                </Link>
              </li>

              <li>
                <Link
                  href="/gallery"
                  className="transition-colors hover:text-[#C9A84C]"
                >
                  {nav.gallery}
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#C9A84C]"
                >
                  {nav.contact}
                </Link>
              </li>

            </ul>
          </div>

          {/* ===================== CONTACT ===================== */}
          <div>
            <h4 className="mb-7 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A84C]">
              {footer.contact || "Contact"}
            </h4>

            <div className="space-y-5 text-[13px] font-medium text-[#A0A0A0]">

              {/* Adresse */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#C9A84C]"
                />

                <span>
                  {footer.address || "Béni Mellal, Maroc"}
                </span>
              </div>

              {/* Téléphone */}
              <a
                href="tel:+212618737715"
                className="flex items-center gap-3 transition-colors hover:text-[#C9A84C]"
              >
                <Phone
                  size={16}
                  className="shrink-0 text-[#C9A84C]"
                />

                <span>
                  +212 6 18 73 77 15
                </span>
              </a>

            </div>
          </div>

        </div>

        {/* ===================== WHATSAPP CTA ===================== */}
        <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#C9A84C]/10 bg-white/[0.02] p-6 md:flex-row md:items-center">

          <div>
            <h3 className="text-sm font-semibold text-white">
              {footer.needHelp || "Besoin d'aide ?"}
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#777]">
              {footer.whatsappDescription ||
                "Contactez-nous directement sur WhatsApp pour toute question concernant nos bijoux."}
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-full border border-[#C9A84C]/30 px-5 py-3 text-xs font-semibold text-[#C9A84C] transition-all duration-300 hover:bg-[#C9A84C] hover:text-black"
          >
            <MessageCircle size={16} />
            {footer.contactWhatsApp || "Contacter sur WhatsApp"}
          </a>

        </div>

        {/* ===================== BOTTOM ===================== */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/5 pt-8 text-[11px] text-[#777] md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} Khalid Bijoux.{" "}
            {footer.rights}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">

            <Link
              href="/contact"
              className="transition-colors hover:text-[#C9A84C]"
            >
              {nav.contact}
            </Link>

            <Link
              href="/privacy"
              className="transition-colors hover:text-[#C9A84C]"
            >
              {footer.privacy || "Confidentialité"}
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-[#C9A84C]"
            >
              {footer.terms || "Conditions"}
            </Link>

          </div>

        </div>

      </div>
    </footer>
  )
}