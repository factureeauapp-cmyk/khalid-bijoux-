"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "../CartContext"
import { useAppContext } from "../providers/AppContext"
import Logo from "./Logo"
import LanguageSwitcher from "./LanguageSwitcher"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, isHydrated } = useCart()
  const { t } = useAppContext()
  const nav = t("nav")

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: nav.home, href: "/" },
    { name: nav.shop, href: "/shop" },
    { name: nav.about, href: "/about" },
    { name: nav.gallery, href: "/gallery" },
    { name: nav.contact, href: "/contact" },
  ]

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`fixed top-0 z-[999] flex h-[78px] w-full items-center px-5 md:px-10 transition-all duration-300 ${
          isScrolled ? "border-b border-[#C9A84C]/10 bg-[#0D0D0D]/90 backdrop-blur-[12px]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
          <Logo />

          <div className="hidden items-center space-x-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative text-[13px] font-medium text-[#E7E0D3] transition-all hover:text-[#C9A84C]"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#C9A84C] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <Link href="/cart" className="relative text-[#E7E0D3] transition-colors hover:text-[#C9A84C]">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {isHydrated && totalItems > 0 && (
                <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-[#C9A84C] px-1.5 py-0.5 text-center text-[10px] font-bold text-black">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-[#E7E0D3] transition-colors hover:text-[#C9A84C] lg:hidden"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black p-12"
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute right-10 top-10 text-accent transition-transform duration-500 hover:rotate-90"
            >
              <X size={40} strokeWidth={1} />
            </button>
            <div className="mb-8">
              <LanguageSwitcher />
            </div>
            <ul className="space-y-8 text-center">
              {navLinks.map((link, idx) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-cormorant font-bold tracking-wide text-white transition-colors hover:text-[#C9A84C]"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
