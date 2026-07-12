"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, ShoppingBag, X } from "lucide-react"
import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"
import LanguageSwitcher from "./LanguageSwitcher"
import Logo from "./Logo"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, isHydrated } = useCart()
  const { t } = useAppContext()
  const nav = t("nav")
  const brandName = t("brandName")
  const tagline = t("tagline")
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (panelRef.current && !panelRef.current.contains(target) && !buttonRef.current?.contains(target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { name: nav.home, href: "/" },
    { name: nav.shop, href: "/shop" },
    { name: nav.about, href: "/about" },
    { name: nav.gallery, href: "/gallery" },
    { name: nav.contact, href: "/contact" },
  ]

  const isActiveLink = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed top-0 z-999 flex h-19.5 w-full items-center px-4 transition-all duration-300 sm:px-6 md:px-10 ${
          isScrolled ? "border-b border-[#C9A84C]/10 bg-[#0D0D0D]/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-350 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Logo />
          </div>

          <div className="hidden items-center space-x-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative text-[13px] font-medium text-[#E7E0D3] transition-all duration-300 hover:text-[#C9A84C]"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#121212]/80 text-[#E7E0D3] transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C]">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {isHydrated && totalItems > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#C9A84C] px-1.5 py-0.5 text-center text-[10px] font-bold text-black">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              ref={buttonRef}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-panel"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A84C]/20 bg-[#121212]/80 text-[#E7E0D3] transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C] lg:hidden"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMenuOpen ? 180 : 0, opacity: isMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.24 }}
                className="absolute"
              >
                <Menu size={20} strokeWidth={1.7} />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ rotate: isMenuOpen ? 0 : -180, opacity: isMenuOpen ? 1 : 0 }}
                transition={{ duration: 0.24 }}
                className="absolute"
              >
                <X size={20} strokeWidth={1.7} />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-60 bg-[#050505]/80 backdrop-blur-xl"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.aside
              ref={panelRef}
              id="mobile-navigation-panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
              className="fixed right-0 top-0 z-70 flex h-full w-[min(88vw,360px)] flex-col border-l border-[#C9A84C]/20 bg-[#050505]/95 px-5 py-5 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between pb-5">
                <div className="flex min-w-0 items-center gap-3">
                {/* <Logo className="gap-3" /> */}
              </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={t("closeMenu")}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#E7E0D3] transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                >
                  {/* <X size={19} strokeWidth={1.7} /> */}
                </button>
              </div>

              <div className="mb-6 rounded-[18px] border border-white/10 bg-[#111111]/80 p-3">
                <LanguageSwitcher />
              </div>

              <nav className="flex-1">
                <ul className="space-y-2">
                  {navLinks.map((link, index) => {
                    const active = isActiveLink(link.href)
                    return (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index, duration: 0.24 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] tracking-[0.02em] transition-all duration-300 ${
                            active
                              ? "bg-[#C9A84C]/15 text-[#E8C97E] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                              : "text-[#F6EFE4] hover:bg-white/5 hover:text-[#C9A84C]"
                          }`}
                        >
                          <span className="font-cormorant text-[1.05rem]">{link.name}</span>
                          <span className={`text-[10px] uppercase tracking-[0.3em] ${active ? "text-[#C9A84C]" : "text-white/40"}`}>
                            {active ? "●" : ""}
                          </span>
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>

              <div className="mt-6 rounded-[18px] border border-[#C9A84C]/20 bg-[#0F0F0F] p-4 text-sm leading-6 text-[#d8cfbf]">
                <p className="font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">
                  {brandName}
                </p>
                <p className="mt-2 text-[13px] text-white/70">
                  {tagline}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
