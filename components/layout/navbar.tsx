"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, Heart, Search } from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { setIsCartOpen, cartCount, wishlistCount } = useStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "glass py-3" : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center"
              >
                <span className="font-serif text-2xl md:text-3xl gold-gradient-text font-bold tracking-wider">
                  {siteConfig.name.split(" ")[0]}
                </span>
                <span className="font-serif text-sm md:text-base text-primary/80 tracking-[0.3em] uppercase">
                  {siteConfig.name.split(" ")[1]}
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-foreground/80 hover:text-primary transition-colors duration-300 text-sm uppercase tracking-wider group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-foreground/80 hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <Link href="/wishlist">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
            <nav className="relative h-full flex flex-col items-center justify-center gap-8 pt-20">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
