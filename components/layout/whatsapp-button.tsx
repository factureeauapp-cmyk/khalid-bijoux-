"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { siteConfig } from "@/lib/config"

export function WhatsAppButton() {
  const message = encodeURIComponent(
    `Hi ${siteConfig.name}! I'm interested in your jewellery collection. Can you help me?`
  )
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${message}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:block font-medium">Chat with us</span>
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
    </motion.a>
  )
}
