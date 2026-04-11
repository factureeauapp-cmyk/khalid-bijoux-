"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react"
import { siteConfig } from "@/lib/config"

const footerLinks = {
  shop: [
    { label: "All Jewellery", href: "/shop" },
    { label: "Necklaces", href: "/shop?category=Necklaces" },
    { label: "Rings", href: "/shop?category=Rings" },
    { label: "Earrings", href: "/shop?category=Earrings" },
    { label: "Bangles", href: "/shop?category=Bangles" },
    { label: "Wedding Sets", href: "/shop?category=Wedding%20Sets" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
    { label: "Store Locations", href: "/contact" },
  ],
  support: [
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col">
              <span className="font-serif text-3xl gold-gradient-text font-bold tracking-wider">
                {siteConfig.name.split(" ")[0]}
              </span>
              <span className="font-serif text-base text-primary/80 tracking-[0.3em] uppercase">
                {siteConfig.name.split(" ")[1]}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.tagline}. Crafting exquisite jewellery since 1965 in the heart of Ahmedabad.
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.1, color: "#D4AF37" }}
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border rounded-full text-muted-foreground hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, color: "#D4AF37" }}
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-border rounded-full text-muted-foreground hover:border-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-serif text-lg text-foreground mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-serif text-lg text-foreground mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-serif text-lg text-foreground mb-6">Visit Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-primary transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Fri: {siteConfig.storeHours.weekdays}</p>
                  <p>Saturday: {siteConfig.storeHours.saturday}</p>
                  <p>Sunday: {siteConfig.storeHours.sunday}</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
