"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6"
import { SOCIAL_LINKS } from "@/config/socialLinks"




const animatedSocials = [
  {
    name: "Instagram",
    href: SOCIAL_LINKS.instagram,
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    href: SOCIAL_LINKS.facebook,
    icon: FaFacebookF,
  },
  {
    name: "TikTok",
    href: SOCIAL_LINKS.tiktok,
    icon: FaTiktok,
  },
]

export default function SocialMediaBar() {
  const [socialIndex, setSocialIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSocialIndex((previous) => {
        return (previous + 1) % animatedSocials.length
      })
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  const currentSocial = animatedSocials[socialIndex]
  const SocialIcon = currentSocial.icon

  return (
    <div className="flex items-center justify-center">
      {/* Instagram / Facebook / TikTok */}
      <div className="relative flex h-9 w-9 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.a
            key={currentSocial.name}
            href={currentSocial.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={currentSocial.name}
            title={currentSocial.name}
            initial={{
              opacity: 0,
              y: 7,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -7,
              scale: 0.7,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              flex h-9 w-9
              items-center justify-center
              rounded-full
              text-[#A8A8A8]
              transition-all
              duration-300
              hover:scale-110
              hover:text-[#C9A84C]
            "
          >
            <SocialIcon size={18} />
          </motion.a>
        </AnimatePresence>
      </div>

      {/* Séparateur */}
      <span className="mx-2 h-4 w-px bg-[#C9A84C]/35" />

      {/* WhatsApp fixe */}
      <motion.a
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="WhatsApp"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        className="
          flex h-9 w-9
          items-center justify-center
          rounded-full
          text-[#C9A84C]
          transition-colors
          duration-300
          hover:text-[#E3C56B]
        "
      >
        <FaWhatsapp size={19} />
      </motion.a>
    </div>
  )
}